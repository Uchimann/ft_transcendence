import jwt
import datetime
from django.conf import settings


class JWTUtils:
    @staticmethod
    def create_token(payload: dict) -> str:
        expiration = datetime.datetime.utcnow() + datetime.timedelta(days=1)
        payload['exp'] = expiration
        token = jwt.encode(payload, settings.SECRET_KEY, algorithm='HS256')
        return token

    @staticmethod
    def decode_token(token: str) -> dict:
        try:
            decoded_payload = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
            return decoded_payload
        except jwt.ExpiredSignatureError:
            raise Exception("Token has expired")
        except jwt.InvalidTokenError:
            raise Exception("Invalid token")
