from abc import abstractmethod, ABC
from typing import Tuple, List
from uuid import UUID

from src.models.models import User


class UserService:

    @abstractmethod
    def get_user_by_id(self, id: int) -> Tuple[User, str]:
        pass

    @abstractmethod
    def get_user_by_username(self, username: str) -> Tuple[User, str]:
        pass

    @abstractmethod
    def get_user_by_email(self, email: str) -> Tuple[User, str]:
        pass

    @abstractmethod
    def create_user(self, user: User) -> Tuple[bool, str]:
        pass

    @abstractmethod
    def delete_user(self, id: UUID) -> Tuple[bool, str]:
        pass

    @abstractmethod
    def get_all_users(self) -> List[User]:
        pass