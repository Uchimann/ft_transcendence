
from django.urls import path, include

from .views.views import FriendServiceHandler

urlpatterns = [
    path('add/', FriendServiceHandler.as_view({'post': 'add_as_friend'}), name='send-request'),
    path('friend-list/', FriendServiceHandler.as_view({'get': 'get_friend_list'}), name='friend-list'),
]