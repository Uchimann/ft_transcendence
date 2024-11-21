from django.contrib import admin
from django.urls import path, include
urlpatterns = [
    path('src/', admin.site.urls),
    path('friend/', include('src.urls')),
]