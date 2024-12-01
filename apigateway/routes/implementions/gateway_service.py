
import requests

from rest_framework.response import Response

from rest_framework import status

import logging

from typing import Dict

from ..interface.gateway_service import GatewayService
from ..implementions.gateway_repository import GatewayRepositoryImpl


logger = logging.getLogger('apigateway')


class GatewayServiceImpl(GatewayService):
    def __init__(self, repository: GatewayRepositoryImpl):

        self.repository = repository


    def process_request(self, request: any, path: str) -> Response:

        base_url, error = self.repository.get_service_url(path)
        if error:

            return Response({'error': error}, status=status.HTTP_404_NOT_FOUND)


        full_url = f"{base_url}/{path}"
        logger.info(f"Forwarding request to: {full_url}")


        params = self._get_request_params(request)

        response, error = self.repository.forward_request(
            method=request.method.lower(),
            url=full_url,
            headers=dict(request.headers),
            params=params
        )

        if error:

            return Response({'error': error}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


        return self._handle_response(response)


    def _get_request_params(self, request: any) -> Dict:
        params = {}

        if request.method.lower() in ['post', 'put', 'patch']:
            params['json'] = request.data if request.data else request.query_params.dict()
        else:

            params['params'] = request.query_params.dict()
        return params


    def _handle_response(self, response: requests.Response) -> Response:

        if response.headers.get('content-type') == 'application/json':
            return Response(response.json(), status=response.status_code)
        return Response(response.content, status=response.status_code)
