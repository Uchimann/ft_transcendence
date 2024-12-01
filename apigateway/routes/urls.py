from django.contrib import admin


from django.urls import include, path



from .views.views import APIGatewayView
urlpatterns = [

    path('<path:path>', APIGatewayView.as_view(), name='api_gateway'),  
]
