from abc import abstractmethod

from src.models.models import User


class AuthRepository:
    def __init__(self):
        super().__init__()

    @abstractmethod
    def login(self, username, password):
        pass

    @abstractmethod
    def generate_token(self, user : User) -> str:
        pass