from typing import Tuple

from django.contrib.auth.hashers import check_password

from src.interface.auth_repository import AuthRepository
from src.models.models import User
from src.utils import JWTUtils


class AuthRepositoryImpl(AuthRepository):
    def login(self, username: str, password: str) -> Tuple[str, bool]:
        try:
            saved_user = User.objects.get(username=username)
            if check_password(password, saved_user.password):
                token = self.generate_token(saved_user)
                return token, True
            return "Wrong password", False
        except User.DoesNotExist:
            return "User not found", False
        except Exception as e:
            return f"Error: {str(e)}", False

    def generate_token(self, user: User) -> str:
        payload = {
            'username': user.username,
            'user_id': str(user.id)
        }
        return JWTUtils.create_token(payload)
