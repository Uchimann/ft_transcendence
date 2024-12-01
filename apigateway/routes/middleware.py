import jwt 
from django.conf import settings 
from django.http import JsonResponse 
import logging  


logger = logging.getLogger('apigateway')
logger.setLevel(logging.DEBUG)

class JWTAuthenticationMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response 

    def __call__(self, request):
        
        exempt_paths = ['/users/create/', '/users/login/','/users/validate/', '/users/oauth_callback/']
        if request.path in exempt_paths:
            return self.get_response(request) 

        
        token = request.headers.get('Authorization')
        user_id_header = request.headers.get('id') 
        logger.error('User-ID: %s', user_id_header)

        if not token:
            logger.debug('Missing token') 
            return JsonResponse({'error': 'Missing token'}, status=401)  
        
        if not user_id_header:
            logger.debug('Missing User-ID')  
            return JsonResponse({'error': 'Missing User-ID'}, status=400) 

        try:
            
            token = token.split(' ')[1]
            logger.debug('Token: %s', token)  

            
            decoded_token = jwt.decode(token, settings.USER_SECRET_KEY, algorithms=['HS256'])
            logger.debug('Decoded Token: %s', decoded_token)

            
            token_user_id = str(decoded_token['user_id'])
            if str(user_id_header) != token_user_id:
                logger.debug(f"User-ID mismatch: Header({user_id_header}) != Token({token_user_id})")
                return JsonResponse({'error': 'User-ID mismatch'}, status=403)  

            
            request.user_id = token_user_id

            
            logger.debug('********** Token is valid **********')
            logger.debug('Token is valid for user_id: %s', request.user_id)
            logger.debug('************************************')

        except jwt.ExpiredSignatureError:
            logger.debug('Token has expired')  
            return JsonResponse({'error': 'Token has expired'}, status=401)
        except jwt.InvalidTokenError:
            logger.debug('Invalid token')
            return JsonResponse({'error': 'Invalid token'}, status=401)
        except Exception as e:
            logger.debug('Error decoding token: %s', str(e))
            return JsonResponse({'error': str(e)}, status=400)

        return self.get_response(request)

    