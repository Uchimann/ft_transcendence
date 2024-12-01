from abc import abstractmethod

from src.models.models import User


class AuthRepository:
    def __init__(self):
        super().__init__()

    @abstractmethod
    def login(self, username, password):
        pass

    @abstractmethod
    def validate_twofa(self, user: User):
        pass
    
    @abstractmethod
    def get_user_by_id(self, user_id: int) -> User:
        pass
    