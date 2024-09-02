from typing import Tuple, List
from uuid import UUID

from .interface.repository import UserRepository
from .models import UserManagement


class UserServiceImpl:

    def __init__(self, user_repository: UserRepository):
        self.user_repository = user_repository

    def get_user_by_id(self, id: int) -> Tuple[UserManagement, str]:
        user, message = self.user_repository.get_by_id(id)
        return user, message

    def get_user_by_username(self, username: str) -> Tuple[UserManagement, str]:
        user, message = self.user_repository.get_by_username(username)
        return user, message

    def get_user_by_email(self, email: str) -> Tuple[UserManagement, str]:
        user, message = self.user_repository.get_by_email(email)
        return user, message

    def create_user(self, user: UserManagement) -> Tuple[bool, str]:
        success, message = self.user_repository.create_user(user)
        return success, message

    def delete_user(self, id: UUID) -> Tuple[bool, str]:
        success, message = self.user_repository.delete_user(id)
        return success, message

    def get_all_users(self) -> List[UserManagement]:
        return self.user_repository.get_all()