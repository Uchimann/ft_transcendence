from abc import abstractmethod
from logging import Manager
from typing import Tuple
from django.db.models import UUIDField


from django.forms import BooleanField

from transandancefirst.usermanagment.interface.service import UserService
from transandancefirst.usermanagment.models import UserManagement

class UserRepository(UserService):

    @abstractmethod
    def get_by_id(self, id : int) -> Tuple[UserManagement, str]:
        pass

    @abstractmethod
    def get_by_username(self, username: str) -> Tuple[UserManagement, str]:
        pass

    @abstractmethod
    def get_by_email(self, email: str) -> Tuple[UserManagement, str]:
        pass

    @abstractmethod
    def create_user (self, user : UserManagement) -> Tuple[BooleanField,str]:
        pass

    @abstractmethod
    def delete_user(self, id : UUIDField) -> Tuple[BooleanField,str]:
        pass

    @abstractmethod
    def get_all(self):
        pass