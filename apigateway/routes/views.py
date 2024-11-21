# Gerekli kütüphaneleri içe aktarır
import logging
import requests
from django.conf import settings
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

# Logger ayarlarını yapar
logger = logging.getLogger('apigateway')  # 'apigateway' adıyla bir logger oluşturur
logger.setLevel(logging.DEBUG)  # Logger seviyesini DEBUG olarak ayarlar

# API Gateway için view sınıfı
class APIGatewayView(APIView):
    # GET isteği için yönlendirme
    def get(self, request, path):
        return self.proxy_request(request, path)

    # POST isteği için yönlendirme
    def post(self, request, path):
        return self.proxy_request(request, path)

    # PUT isteği için yönlendirme
    def put(self, request, path):
        return self.proxy_request(request, path)

    # PATCH isteği için yönlendirme
    def patch(self, request, path):
        return self.proxy_request(request, path)

    # DELETE isteği için yönlendirme
    def delete(self, request, path):
        return self.proxy_request(request, path)

    # Gelen isteği ilgili mikro servise yönlendiren ana metod
    def proxy_request(self, request, path):
        # Yönlendirme yapılacak temel URL'yi alır
        base_url = self.get_service_url(path)
        #base url -> http://usermanagementc:8000
        # Eğer geçerli bir URL bulunamazsa hata döner
        if not base_url:
            return Response({'error': 'Invalid path'}, status=status.HTTP_404_NOT_FOUND)

        # Tam URL'yi oluşturur
        full_url = f"{base_url}/{path}" # http://usermanagementc:8000/users/create/

        logger.info(f"Forwarding request to: {full_url}")

        # İstek parametrelerini alır
        request_params = self.get_request_params(request) # {'json': {'name': 'John Doe', 'email': '
        logger.info(f"Forwarding request to: {full_url} with params: {request_params}")
        
        # İsteği ilgili servise yönlendirir
        response = self.forward_request(request, full_url, request_params) # {'json': {'name': 'John Doe', 'email': '
        logger.info(f"Response received: {response.status_code}")
        
        # Gelen yanıtı işler ve geri döner
        return self.handle_response(response)

    # URL yolu ile ilgili mikro servisin temel URL'sini bulur
    def get_service_url(self, path):
        for route, url in settings.SERVICE_ROUTES.items(): # settings.py dosyasındaki SERVICE_ROUTES değişkenindeki tüm mikro servislerin URL'lerini döner
            if path.startswith(route): # Eğer path, route ile başlıyorsa örnk -> /users/create/ -> /users/
                return url # İlgili servisin URL'sini döner örn -> users: http://usermanagementc:8000
        
        # Geçerli bir URL bulunamazsa hata loglar
        logger.error("No matching service URL found for path: %s", path)
        return None

    # Gelen isteğin parametrelerini hazırlayan metod
    def get_request_params(self, request):
        params = {}
        # Eğer istek POST, PUT veya PATCH ise, json verisini alır
        if request.method.lower() in ['post', 'put', 'patch']:
            params['json'] = request.data if request.data else None
        else:
            # GET veya DELETE isteği ise, sorgu parametrelerini alır
            params['params'] = request.query_params.dict()
        return params

    # İsteği ilgili servise ileten metod
    def forward_request(self, request, url, params):
        # Gelen isteğin metodunu küçük harfe çevirir
        method = request.method.lower()
        
        # Gelen isteğin header bilgilerini alır
        headers = dict(request.headers)
        
        # Debug logları ile isteğin detaylarını kaydeder
        logger.debug("*** Forwarding request ***")
        logger.debug("HTTP Method: %s", method)
        logger.debug("Request URL: %s", url)
        logger.debug("Request Headers: %s", headers)
        logger.debug("Request Params: %s", params)
        logger.debug("***************************")
        
        try:
            # HTTP isteğini gönderir
            response = requests.request(
                method=method,
                url=url,
                headers=headers,
                **params
            )
            # İstek başarılı ise log kaydeder
            logger.info("Request successful: %s", url)
            return response
        except requests.exceptions.RequestException as e:
            # İstek sırasında hata olursa log kaydeder ve hata yanıtı döner
            logger.error("Request error: %s", e)
            return Response({'error': 'Internal server error'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def handle_response(self, response):
            # Yanıt JSON ise, JSON formatında geri döner
            if response.headers.get('content-type') == 'application/json':
                return Response(response.json(), status=response.status_code) # response.json() -> {'id': 1, 'name': 'John Doe', 'email': '
            # Aksi takdirde, yanıtı olduğu gibi döner
            return Response(response.content, status=response.status_code)


#Kod ilk olarak gerekli isteklerin yönlendirilmesi için APIGatewayView adında bir sınıf oluşturur. 
#Bu sınıf, Django'nun APIView sınıfından türetilmiştir ve HTTP GET, POST, PUT, PATCH ve DELETE isteklerini yönlendirmek için beş ayrı metoda sahiptir.
#Bu metotlar, gelen isteği ilgili mikro servise yönlendirir ve gelen yanıtı işler.
#Örnek olarak http://localhost:8000/users/create/ isteği url kısmında path olarak -> users/create/
#view'e gönderilir ve bu istek view tarafından ilgili mikro servise yönlendirilir.
#view'de gerekli isteğe göre uygun metot çağrılır(get, post, put, patch, delete)
#proxy_request metodu, gelen isteğin türüne ve yoluna göre url'yi oluşturur
#daha sonra gelen isteklerinin parametrelerini ayarlar -> get_request_params
#ve bu isteği ilgili servise yönlendirir -> forward_request
#son olarak gelen yanıtı işler ve geri döner -> handle_response


#Genel olarak olan senaryo şu şekildedir:
#1. Kullanıcı bir istekte bulunur.
#2. Django uygulaması, gelen isteği APIGatewayView sınıfına yönlendirir.
#3. APIGatewayView sınıfı, gelen isteği ilgili mikro servise yönlendirir.
#4. Mikro servis, gelen isteği işler ve bir yanıt döner.
#5. APIGatewayView sınıfı, gelen yanıtı işler ve kullanıcıya geri döner.
#6. Kullanıcı, mikro servisin yanıtını alır ve işlemine devam eder.
#Bu süreç, Django uygulaması ve mikro servisler arasında bir aracı olarak APIGatewayView sınıfını kullanarak gerçekleştirilir.
#Bu sınıf, gelen istekleri doğru mikro servise yönlendirir ve gelen yanıtları işler. Bu sayede, Django uygulaması ve mikro servisler arasındaki iletişim sağlanmış olur.
#Bu sayede, Django uygulaması ve mikro servisler arasındaki iletişim sağlanmış olur. Bu sınıf, Django uygulaması ve mikro servisler arasındaki iletişimi kolaylaştırır ve yönetir.
