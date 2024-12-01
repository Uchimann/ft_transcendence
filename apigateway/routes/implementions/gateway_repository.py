
import logging

import requests

from typing import Dict, Tuple, Optional

from ..interface.gateway_repository import GatewayRepository

from django.conf import settings


logger = logging.getLogger('apigateway')


class GatewayRepositoryImpl(GatewayRepository):

    def forward_request(self, method: str, url: str, headers: Dict, params: Dict) -> Tuple[Optional[requests.Response], str]:
        try:

            response = requests.request(
                method=method,
                url=url,
                headers=headers,
                **params
            )
            logger.info(f"Request successful: {url}")
            return response, ""
        except:

            logger.error(f"Request failed for URL: {url}")
            return None, "Request failed"


    def get_service_url(self, path: str) -> Tuple[Optional[str], str]:

        for route, url in settings.SERVICE_ROUTES.items():
            if path.startswith(route):
                return url, ""

        logger.error(f"No matching service URL found for path: {path}")
        return None, "Service not found"
