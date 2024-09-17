from abc import abstractmethod


class AuthService:
    @abstractmethod
    def login(self, validated_data):
        pass

    @abstractmethod
    def validate_token(self, token):
        pass
