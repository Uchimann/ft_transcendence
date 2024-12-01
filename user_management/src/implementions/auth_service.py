from typing import Optional, Tuple

import requests
from src.implementions.auth_repository import AuthRepositoryImpl
from src.interface.auth_service import AuthService
from src.utils import Utils
from src.models.models import User
from django.utils import timezone
from django.conf import settings
import logging

# Logger'ı ayarla
logger = logging.getLogger(__name__)


class AuthServiceImpl(AuthService):
    def __init__(self, auth_repository: AuthRepositoryImpl):
        self.auth_repository = auth_repository

    def login(self, validated_data: dict) -> dict:
        username = validated_data.get('username') # Kullanıcı adını al
        password = validated_data.get('password') # Şifreyi al
        
        # Kullanıcıyı login metodu ile al repository'den
        user = self.auth_repository.login(username, password)
        
        if user is None: # Kullanıcı yoksa hata döndür
            return {'success': False, 'error': "User not found or wrong password"}

        # 2FA ve token işlemleri burada yapılır
        try:
            # 2FA doğrulama işlemleri için geçici token oluştur
            temp_token = Utils.generate_token(user, is_2fa_validated=False)# Geçici token oluştur
            twofa_code = Utils.set_twofa_code(user)  # 2FA kodu oluştur
            success = Utils.send_2fa_code(user.email, twofa_code)  # 2FA kodunu gönder
            if not success: # Eğer 2FA kodu gönderilemediyse hata döndür
                return {'success': False, 'error': "2FA code sent but failed to deliver"}
            return { # İşlem başarılıysa geçici token'ı döndür
                'success': True, # İşlem başarılı
                'temp_token': temp_token # Geçici token'ı döndür
            }
        except Exception as e: # Hata olursa logla ve hata döndür
            logger.error(f"Error during login: {str(e)}")
            return {'success': False, 'error': f"Error: {str(e)}"}


    def validate_twofa(self, user: User, twofa_code: str) -> bool: # 2FA kodunu doğrula
        try:
            if user.twofa_code == twofa_code and user.twofa_code_expiry > timezone.now(): # 2FA kodu doğru ve süresi geçmemişse
                user.twofa_code = None # 2FA kodunu temizle neden ? -> önceki 2FA kodu ile tekrar doğrulama yapılmasın
                user.twofa_code_expiry = None # 2FA kodunun süresini temizle
                self.auth_repository.validate_twofa(user) # 2FA doğrulamasını yap
                logger.info(f"User {user.username} validated 2FA successfully.")
                return True
            return False
        except Exception as e:
            logger.error(f"Error during 2FA validation: {str(e)}")
            return False

    def get_user_from_token(self, token: str) -> User: # Token'dan kullanıcıyı al
        try:
            decoded_token = Utils.decode_token(token)  # Token'ı çöz
            user_id = decoded_token.get('user_id')  # Kullanıcı ID'sini al
            return self.auth_repository.get_user_by_id(user_id)  # Kullanıcıyı repository'den al
        except (ValueError, Exception) as e:
            logger.error(f"Error during token decoding: {str(e)}")
            return None
        
    #logout işlemi
    def logout(self, user: User) -> tuple:
        try:
            user.is_online = False  # Kullanıcıyı çevrimdışı yap
            user.save()  # Veritabanında güncelle
            
            logger.info(f"User {user.username} logged out successfully.")
            logger.info(f"User {user.username} is online: {user.is_online}")
            
            return True, "User logged out successfully."
        
        except Exception as e:
            logger.error(f"Error during logout: {str(e)}")
            return False, "An error occurred during logout."
        
    #oauth_callback işlemi
    def oauth_callback(self, code: str) -> Tuple[bool, str, Optional[str]]:
        # Client ID ve Client Secret, 42 API'yi tanımlayan kimlik bilgileridir.
        client_id = settings.INTRA_CLIENT_ID
        client_secret = settings.INTRA_CLIENT_SECRET
        redirect_uri = settings.INTRA_REDIRECT_URI

        # Token almak için POST isteği gönderiyoruz.
        token_response = requests.post(
            "https://api.intra.42.fr/oauth/token",
            data={
                "grant_type": "authorization_code",  # OAuth2 akış türü.
                "client_id": client_id,  # 42 API'ye gönderilen uygulama kimliği.
                "client_secret": client_secret,  # Uygulama gizli anahtarı.
                "code": code,  # Kullanıcıdan alınan yetkilendirme kodu.
                "redirect_uri": redirect_uri,  # Yetkilendirme sonrası döndüğümüz URL.
            },
        )

        # Eğer token isteği başarısız olursa hata döndürüyoruz.
        if token_response.status_code != 200:
            logger.error('!!!!!!!!!!!!!!!!!!!!!BURAYA GIRMEYEN PICCC')
            return False, 'Failed to obtain access token', None , None

        # Başarılıysa, access token'i alıyoruz.
        access_token = token_response.json().get('access_token')

        # Access token ile kullanıcı bilgilerini çekiyoruz.
        user_info_response = requests.get(
            "https://api.intra.42.fr/v2/me",  # Kullanıcı bilgisi API'si.
            headers={"Authorization": f"Bearer {access_token}"}  # Yetkilendirme başlığı.
        )

        # Kullanıcı bilgisi çekme başarısız olursa hata döndürüyoruz.
        if user_info_response.status_code != 200:
            logger.error('!!!!!!!!!!!!!!!!!!!!!BURAYA GIRMEYEN OCC')
            return False, 'Failed to fetch user information', None , None

        # Kullanıcı bilgilerini JSON formatında alıyoruz.
        user_info = user_info_response.json()
        # Alınan kullanıcı bilgilerini işleyip veritabanına kaydediyoruz.
        success, message, user = self.auth_repository.oauth_callback(user_info)
        #user id yazıdr
        logger.error('User-ID: %s', user.id)
        user_id = user.id
        if success:
            # Kullanıcı başarıyla oluşturulmuşsa JWT token oluşturuyoruz.
            jwt_token = Utils.generate_token(user)
            return True, 'User authenticated successfully', jwt_token, str(user_id)
        return False, message, None , None

