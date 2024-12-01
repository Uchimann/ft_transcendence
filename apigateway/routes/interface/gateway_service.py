from abc import ABC, abstractmethod
from rest_framework.response import Response

class GatewayService(ABC):
    @abstractmethod
    def process_request(self, request: any, path: str) -> Response:
        pass