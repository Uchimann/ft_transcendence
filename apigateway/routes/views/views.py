from rest_framework.views import APIView

from ..implementions.gateway_service import GatewayServiceImpl

from ..implementions.gateway_repository import GatewayRepositoryImpl


class APIGatewayView(APIView):
    def __init__(self, **kwargs):
    
        super().__init__(**kwargs)
    
        self.service = GatewayServiceImpl(GatewayRepositoryImpl())

    
    def get(self, request, path):
    
        return self.service.process_request(request, path)

    
    def post(self, request, path):
        return self.service.process_request(request, path)

    
    def put(self, request, path):
        return self.service.process_request(request, path)

    
    def patch(self, request, path):
        return self.service.process_request(request, path)

    
    def delete(self, request, path):
        return self.service.process_request(request, path)
