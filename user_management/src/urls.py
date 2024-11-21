from django.urls import path
from .views.views import UserManagementHandler, AuthHandler

urlpatterns = [
    # Kullanıcı listeleme isteği `list_users` metoduna yönlendirilir
    path('list/', UserManagementHandler.as_view({'get': 'list_users'}), name='list_users'),

    # Kullanıcı ID'sine göre kullanıcıyı getirme isteği `get_user_by_id` metoduna yönlendirilir
    path('id/', UserManagementHandler.as_view({'get': 'get_user_by_id'}), name='get_user_by_id'),

    # Kullanıcı adına göre kullanıcıyı getirme isteği `get_user_by_username` metoduna yönlendirilir
    path('username/', UserManagementHandler.as_view({'get': 'get_user_by_username'}), name='get_user_by_username'),

    # Kullanıcı e-posta adresine göre kullanıcıyı getirme isteği `get_user_by_email` metoduna yönlendirilir
    path('email/', UserManagementHandler.as_view({'get': 'get_user_by_email'}), name='get_user_by_email'),

    # Kullanıcı oluşturma isteği `create_user` metoduna yönlendirilir
    path('create/', UserManagementHandler.as_view({'post': 'create_user'}), name='create_user'),

    # Kullanıcı silme isteği `delete_user` metoduna yönlendirilir
    path('delete/', UserManagementHandler.as_view({'delete': 'delete_user'}), name='delete_user'),

    # Kullanıcı giriş isteği `login` metoduna yönlendirilir
    path('login/', AuthHandler.as_view({'post': 'login'}), name='login'),

    # İki adımlı doğrulama (2FA) doğrulama isteği `validate_twofa` metoduna yönlendirilir
    path('validate/', AuthHandler.as_view({'post': 'validate_twofa'}), name='validate_twofa'),

    # Kullanıcı bilgilerini güncelleme isteği `update_user` metoduna yönlendirilir
    path('update/', UserManagementHandler.as_view({'put': 'update_user'}), name='update_user'),
    
    path('upload_avatar/', UserManagementHandler.as_view({'post': 'upload_avatar'}), name='upload_avatar'),
    
    #logout
    path('logout/', AuthHandler.as_view({'post': 'logout'}), name='logout'),
    
    #beonline
    path('beonline/', AuthHandler.as_view({'post': 'beonline'}), name='beonline'),
    
    path('check_username/', UserManagementHandler.as_view({'get': 'check_username'}), name='check_username'),
    
    #oauthcallback
    path('oauth_callback/', AuthHandler.as_view({'post': 'oauth_callback'}), name='oauth_callback'),
]
'''
Asviews() fonksiyonu, bir sınıf tabanlı görünümü işlev tabanlı bir görünüme dönüştürür.
örneğin:
path('list/', UserManagementHandler.as_view({'get': 'list_users'}), name='list_users'),
UserManagementHandler.as_view({'get': 'list_users'}) ifadesi, UserManagementHandler sınıfının list_users() metodunu işlev tabanlı bir görünüme dönüştürür.
Bu, list_users() metodunu çağırmak için bir GET isteğini işleyen bir işlev tabanlı görünüm oluşturur.
asiviews methodunu detaylıca açıkla :
as_view() yöntemi, bir sınıf tabanlı görünümü işlev tabanlı bir görünüme dönüştürür.
Bu, Django'nun işlev tabanlı görünümlerle çalışmasını sağlar.
Örneğin, bir sınıf tabanlı görünümü bir URL şablonuna eklemek için as_view() yöntemini kullanabilirsiniz.
Örneğin, aşağıdaki gibi bir sınıf tabanlı görünümü bir URL şablonuna ekleyebilirsiniz:
'''
