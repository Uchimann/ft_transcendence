from django.urls import path

from .views.views import GameHandler


urlpatterns = [
    #path('', index, name='index'),
    path('list/', GameHandler.as_view({'get': 'get_game_list'}), name='get_game_list'),
    path('save/', GameHandler.as_view({'post': 'save_game'}), name='save_game'),
    path('delete/', GameHandler.as_view({'get': 'delete_game'}), name='delete_game'),

]