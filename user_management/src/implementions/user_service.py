from typing import Tuple, List
from uuid import UUID
from venv import logger

from django.db.models import CharField

from src.interface.user_service import UserService
from .user_repository import UserRepositoryImpl
from ..models.models import User
from src.implementions.user_repository import UserRepository
from src.utils import Utils
from src.serializers.serializers import UpdateUserSerializer


class UserServiceImpl(UserService):
    def __init__(self, user_repository: UserRepositoryImpl):
        self.user_repository = user_repository

    def get_user_by_id(self, user_id: UUID) -> Tuple[User, str]:
        user, message = self.user_repository.get_by_id(user_id)
        return user, message

    def get_user_by_username(self, username: str) -> Tuple[User, str]:
        return self.user_repository.get_by_username(username)

    def get_user_by_email(self, email: str) -> Tuple[User, str]:
        return self.user_repository.get_by_email(email)

    def create_user(self, validated_data: dict) -> Tuple[bool, str]:
        user = User(**validated_data)
        user.hash_password(validated_data['password'])
        return self.user_repository.create(user)

    def delete_user(self, user_id: UUID) -> Tuple[bool, str]:
        return self.user_repository.delete_user(user_id)

    def get_all_users(self) -> Tuple[List[User], str]:
        return self.user_repository.get_all()
    
    def update_user(self, token: str, user_data: dict):
        # Token'dan geçerli kullanıcıyı al
        current_user = Utils.get_current_user(token)
        if current_user is None:
            #debug yap
            return False, "Invalid token or user.", None

        # Gelen verileri doğrula
        serializer = UpdateUserSerializer(data=user_data)
        if not serializer.is_valid():
            return False, serializer.errors, None

        # Kullanıcı adı eşleşmesini doğrula
        if current_user != serializer.validated_data['current_username']:
            return False, "You do not have permission to update this user.", None

        # Güncelleme işlemi
        success, message = self.user_repository.update_user(serializer.validated_data)
        if success:
            new_token = Utils.create_new_token(serializer.validated_data['username'])
            return True, "", new_token

        return False, message, None
    
    def update_avatar(self, user_id: UUID, avatar_file) -> Tuple[bool, str]:
        # Repository üzerinden kullanıcıyı getir
        user, message = self.user_repository.get_by_id(user_id)
        if not user:
            return False, "User not found."

        # Avatar güncelleme işlemini repository'e yönlendir
        success, message = self.user_repository.update_avatar(user, avatar_file)
        if success:
            return True, "Avatar updated successfully."
        return False, message