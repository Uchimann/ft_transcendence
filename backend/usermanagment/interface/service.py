from abc import abstractmethod, ABC
from typing import Tuple, List
from uuid import UUID

from transandancefirst.usermanagment.models import UserManagement

class UserService(ABC):

    @abstractmethod
    def get_user_by_id(self, id: int) -> Tuple[UserManagement, str]:
        pass

    @abstractmethod
    def get_user_by_username(self, username: str) -> Tuple[UserManagement, str]:
        pass

    @abstractmethod
    def get_user_by_email(self, email: str) -> Tuple[UserManagement, str]:
        pass

    @abstractmethod
    def create_user(self, user: UserManagement) -> Tuple[bool, str]:
        pass

    @abstractmethod
    def delete_user(self, id: UUID) -> Tuple[bool, str]:
        pass

    @abstractmethod
    def get_all_users(self) -> List[UserManagement]:
        pass