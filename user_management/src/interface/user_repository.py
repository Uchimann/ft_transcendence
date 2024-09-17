from abc import abstractmethod
from logging import Manager
from typing import Tuple
from django.db.models import UUIDField


from django.forms import BooleanField

from src.models.models import User


class UserRepository():
    @abstractmethod
    def get_by_id(self, id : int) -> Tuple[User, str]:
        pass

    @abstractmethod
    def get_by_username(self, username: str) -> Tuple[User, str]:
        pass

    @abstractmethod
    def get_by_email(self, email: str) -> Tuple[User, str]:
        pass

    @abstractmethod
    def create (self, user : User) -> Tuple[BooleanField,str]:
        pass

    @abstractmethod
    def delete_user(self, id : UUIDField) -> Tuple[BooleanField,str]:
        pass

    @abstractmethod
    def get_all(self):
        pass