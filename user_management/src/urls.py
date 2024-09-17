from django.urls import path
from .views.views import UserManagementHandler, AuthHandler, index


urlpatterns = [
    #path('', index, name='index'),
    path('list/', UserManagementHandler.as_view({'get': 'list_users'}), name='list_users'),
    path('id/', UserManagementHandler.as_view({'get': 'get_user_by_id'}), name='get_user_by_id'),
    path('username/', UserManagementHandler.as_view({'get': 'get_user_by_username'}), name='get_user_by_username'),
    path('email/', UserManagementHandler.as_view({'get': 'get_user_by_email'}), name='get_user_by_email'),
    path('create/', UserManagementHandler.as_view({'post': 'create_user'}), name='create_user'),
    path('delete/', UserManagementHandler.as_view({'delete': 'delete_user'}), name='delete_user'),
    path('login/', AuthHandler.as_view({'post': 'login'}), name='login'),
    path('validate/', AuthHandler.as_view({'post': 'validate_token'}), name='validate_token'),
]