from abc import ABC, abstractmethod
from typing import Dict, Tuple, Optional
import requests

class GatewayRepository(ABC):
    @abstractmethod
    def forward_request(self, method: str, url: str, headers: Dict, params: Dict) -> Tuple[Optional[requests.Response], str]:
        pass
    
    @abstractmethod
    def get_service_url(self, path: str) -> Tuple[Optional[str], str]:
        pass