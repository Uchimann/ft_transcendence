# Standart ve Üçüncü Parti Kütüphaneler
from flask import Flask, jsonify # type: ignore

import uuid, datetime, jwt, requests
from uuid import UUID
from django.conf import settings
from django.shortcuts import render, redirect
from django.views.decorators.csrf import csrf_exempt

# DRF Kütüphaneleri
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.decorators import action

# Projeye Özel Modüller
from src.models.models import User
from src.utils import Utils
from src.serializers.serializers import (
     UserSerializer, CreateUserSerializer, LoginSerializer, 
    TwoFASerializer
)

# Servis ve Repository Katmanları
from src.implementions.auth_repository import AuthRepositoryImpl
from src.implementions.auth_service import AuthServiceImpl
from src.implementions.user_repository import UserRepositoryImpl
from src.implementions.user_service import UserServiceImpl

from django.utils import timezone

# Logger
from venv import logger

class AuthHandler(viewsets.ViewSet):
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.service = AuthServiceImpl(AuthRepositoryImpl())

    # Kullanıcı girişi
    def login(self, request):
        serializer = LoginSerializer(data=request.data)  # Kullanıcı verilerini doğrulamak için LoginSerializer kullanılır
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        result = self.service.login(serializer.validated_data)  # Doğrulanan verilerle login servisi çağrılır

        # Login başarılıysa geçici bir token ile kullanıcıya 2FA doğrulama isteği gönderilir
        if result['success']:
            return Response({
                'message': '2FA code sent to your email, please validate',
                'temp_token': result['temp_token']
                #user id döndür
            }, status=status.HTTP_200_OK)
            
        # Login başarısızsa hata mesajı döner
        return Response({'error': result['error']}, status=status.HTTP_400_BAD_REQUEST)

    # 2FA doğrulama    
    def validate_twofa(self, request):
        serializer = TwoFASerializer(data=request.data)  # 2FA kodu doğrulamak için TwoFASerializer kullanılır
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        twofa_code = serializer.validated_data.get('twofa_code')

        # JWT token'ı Header'dan al
        auth_header = request.headers.get('Authorization')
        if auth_header is None or not auth_header.startswith('Bearer '):
            return Response({'error': 'Token is missing'}, status=status.HTTP_401_UNAUTHORIZED)

        token = auth_header.split(' ')[1]  # 'Bearer ' kısmını ayırarak token al

        # Token'ı çözümle ve kullanıcıyı al
        user = self.service.get_user_from_token(token)
        if user is None:
            return Response({'error': 'Invalid or expired token'}, status=status.HTTP_401_UNAUTHORIZED)
        user_id = user.id # Kullanıcı ID'sini al
        # 2FA kodunu kontrol et
        validation_result = self.service.validate_twofa(user, twofa_code)
        if validation_result:
            logger.error(f"Is online: {user.is_online}")
            return Response({
                'message': '2FA code validated successfully',
                'user_id': user_id
            }, status=status.HTTP_200_OK)
        
        return Response({'error': 'Invalid 2FA code'}, status=status.HTTP_400_BAD_REQUEST)
    
    #logout
    def logout(self, request):
        token_header = request.META.get('HTTP_AUTHORIZATION', '')
        logger.error(f"Gelen Authorization Header: {token_header}")

        if not token_header or not token_header.startswith('Bearer '):
            return Response({'error': 'Authorization token is missing or invalid.'}, status=status.HTTP_401_UNAUTHORIZED)

        token = token_header.split(' ')[-1]
        user = self.service.get_user_from_token(token)
        if not user:
            return Response({'error': 'User not found or invalid token.'}, status=status.HTTP_401_UNAUTHORIZED)

        result, message = self.service.logout(user)
        if result:
            logger.error(f"Is online: {user.is_online}")
            return Response({'message': message}, status=status.HTTP_200_OK)
        return Response({'error': message}, status=status.HTTP_400_BAD_REQUEST)
    
    #beonline
    def beonline(self, request):
        token_header = request.META.get('HTTP_AUTHORIZATION', '')
        
        if not token_header or not token_header.startswith('Bearer '):
            return Response(
                {'error': 'Authorization token is missing.'}, 
                status=status.HTTP_401_UNAUTHORIZED
            )

        token = token_header.split(' ')[-1]
        user = self.service.get_user_from_token(token)
        
        if not user:
            return Response(
                {'error': 'Invalid token.'}, 
                status=status.HTTP_401_UNAUTHORIZED
            )

        user.is_online = True
        user.save()

        logger.error(f"User {user.username} is online.")
        return Response({'status': 'success'}, status=status.HTTP_200_OK)
    
    @csrf_exempt  # CSRF korumasını bu view için devre dışı bırakıyoruz (dış API çağrısı olduğundan).
    def oauth_callback(self, request):
        # Gelen istekte 'code' parametresini alıyoruz.
        code = request.query_params.get('code')
        logger.error(f"Code: {code}")
        if not code:  # Eğer code yoksa, hata döndürüyoruz.
            return Response({'error': 'Authorization code is missing'}, status=status.HTTP_400_BAD_REQUEST)

        # service'deki oauth_callback metodunu çağırıyoruz.
        success, message, token, user_id = self.service.oauth_callback(code)
        if success:  # İşlem başarılıysa, kullanıcıya bir token dönüyoruz.
            return Response({'token': token, 'user_id': user_id}, status=status.HTTP_200_OK)
        # Başarısız olduğunda hata mesajıyla birlikte dönüyoruz.
        return Response({'error': message}, status=status.HTTP_400_BAD_REQUEST)

    

class UserManagementHandler(viewsets.ViewSet):

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.service = UserServiceImpl(UserRepositoryImpl())
        
    #get_user_by_id
    def get_user_by_id(self, request):
        user_id = request.query_params.get('id')  # Kullanıcı ID'si query parametrelerinden alınır
        if not user_id:
            return Response({'error': 'User id is required'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            if not uuid.UUID(user_id):  # ID'nin UUID formatında olup olmadığını kontrol eder
                return Response({'error': 'Invalid user ID format. Please provide a valid UUID.'},
                                status=status.HTTP_400_BAD_REQUEST)
        except ValueError:
            return Response({'error': 'Invalid user ID format. Please provide a valid UUID.'},
                            status=status.HTTP_400_BAD_REQUEST)

        user, message = self.service.get_user_by_id(UUID(user_id))  # Kullanıcıyı ID ile alır
        if user:
            serializer = UserSerializer(user)
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response({'error': message}, status=status.HTTP_404_NOT_FOUND)  # Kullanıcı bulunamazsa hata mesajı döner
    
    
    #get_user_by_username
    def get_user_by_username(self, request):
        # Authorization başlığından token alınır
        token = request.META.get('HTTP_AUTHORIZATION', '').split(' ')[-1] # Bearer token alınır
        if not token:
            return Response({'error': 'Token is required'}, status=status.HTTP_401_UNAUTHORIZED)

        try:
            # Token'dan kullanıcı adı çözülür
            decoded = Utils.decode_token(token)
            username = decoded.get('username') # Kullanıcı adı alınır
            
            if not username:
                return Response({'error': 'Username not found in token'}, status=status.HTTP_400_BAD_REQUEST)

            # Kullanıcı adı ile veritabanından kullanıcı bulunur
            user, message = self.service.get_user_by_username(username)
            if user:
                serializer = UserSerializer(user) # Kullanıcı verileri serialize edilir
                return Response(serializer.data, status=status.HTTP_200_OK)
        
            return Response({'error': message}, status=status.HTTP_404_NOT_FOUND)
        
        except jwt.ExpiredSignatureError: # Token süresi dolmuşsa hata döner
            return Response({'error': 'Token expired'}, status=status.HTTP_401_UNAUTHORIZED),
        
        except jwt.InvalidTokenError: # Geçersiz token hatası döner
            return Response({'error': 'Invalid token'}, status=status.HTTP_401_UNAUTHORIZED)
        
        except ValueError as e: # Diğer hatalar için hata döner
            return Response({'error': str(e)}, status=status.HTTP_401_UNAUTHORIZED),
        

    #get_user_by_email
    def get_user_by_email(self, request):
        email = request.query_params.get('email') # E-posta adresi query parametrelerinden alınır
        if not email: # E-posta adresi girilmediyse hata döner
            return Response({'error': 'Email is required'}, status=status.HTTP_400_BAD_REQUEST)

        user, message = self.service.get_user_by_email(email) # E-posta adresine göre kullanıcı alınır
        if user: # Kullanıcı bulunduysa veriler serialize edilir
            serializer = UserSerializer(user) # Kullanıcı verileri serialize edilir yani düzenlenir
            return Response(serializer.data, status=status.HTTP_200_OK) # Kullanıcı verileri döner
        return Response({'error': message}, status=status.HTTP_404_NOT_FOUND) # Kullanıcı bulunamazsa hata mesajı döner

    #create_user
    def create_user(self, request):
        serializer = CreateUserSerializer(data=request.data) # Kullanıcı verilerini doğrulamak için CreateUserSerializer kullanılır
        if not serializer.is_valid(): # Eğer veriler doğrulanamazsa hata döner
            return Response({'error': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

        success, message = self.service.create_user(serializer.validated_data) # Doğrulanan verilerle kullanıcı oluşturma servisi çağrılır
        if success:
            return Response({'message': 'User created successfully'}, status=status.HTTP_201_CREATED)
        return Response({'error': message}, status=status.HTTP_400_BAD_REQUEST)

    #delete_user
    def delete_user(self, request):
        user_id = request.query_params.get('id') # Kullanıcı ID'si query parametrelerinden alınır
        if not user_id: # Eğer ID girilmediyse hata döner
            return Response({'error': 'User id is required'}, status=status.HTTP_400_BAD_REQUEST)

        success, message = self.service.delete_user(UUID(user_id)) # Kullanıcı ID'si ile kullanıcı silme servisi çağrılır
        if success:
            return Response({'message': 'User deleted successfully'}, status=status.HTTP_200_OK)
        return Response({'error': message}, status=status.HTTP_400_BAD_REQUEST)
    
    #list_users
    def list_users(self, request): 
        user_list, message = self.service.get_all_users() # Tüm kullanıcıları alır
        if user_list:
            serializer = UserSerializer(user_list, many=True) # Kullanıcı verileri serialize edilir
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response({'message': "Not Found"}, status=status.HTTP_404_NOT_FOUND)

    #update_user
    def update_user(self, request):
        # Authorization başlığından token alınır
        token = request.META.get('HTTP_AUTHORIZATION') 
        if not token or not token.startswith('Bearer '):
            return Response({'error': 'Authorization token is missing or invalid.'}, status=status.HTTP_401_UNAUTHORIZED)

        # İstek verilerini al ve servise gönder
        result, message, new_token = self.service.update_user(token, request.data)
        if result:
            return Response({
                'message': 'User updated successfully',
                'token': new_token,
                'username' : request.data.get('username'),
                'email' : request.data.get('email'),
                'first_name' : request.data.get('first_name'),
                'last_name' : request.data.get('last_name','lastname yok amk'),
            }, status=status.HTTP_200_OK)

        # Başarısız durum
        return Response({'error': message}, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['post'], parser_classes=[MultiPartParser, FormParser])
    @csrf_exempt    
    def upload_avatar(self, request):
        user_id = request.query_params.get('id')
        if not user_id:
            return Response({'error': 'User id is required'}, status=status.HTTP_400_BAD_REQUEST)

        avatar_file = request.FILES.get('profile_picture')
        if not avatar_file:
            return Response({'error': 'No file provided'}, status=status.HTTP_400_BAD_REQUEST)

        # Service katmanına isteği ilet
        success, message = self.service.update_avatar(UUID(user_id), avatar_file)
        if success:
            return Response({'message': message, 'avatar': avatar_file.name}, status=status.HTTP_200_OK)
        return Response({'error': message}, status=status.HTTP_400_BAD_REQUEST)
    
    def check_username(self, request):
        try:
            # Query parametresinden username al
            username = request.query_params.get('username')
            
            if not username:
                return Response(
                    {'error': 'Username is required'}, 
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Direkt model üzerinden sorgu yap
            user = User.objects.filter(username=username).first()
            
            if user:
                return Response(
                    #başarılı oldu yazdır
                    {'id': str(user.id)}, 
                    status=status.HTTP_200_OK
                )
            
            return Response(
                {'error': 'User not found'}, 
                status=status.HTTP_404_NOT_FOUND
            )

        except Exception as e:
            return Response(
                {'error': str(e)}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )