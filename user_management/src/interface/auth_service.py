from abc import abstractmethod


class AuthService:
    @abstractmethod
    def login(self, validated_data):
        pass
    
    @abstractmethod
    def validate_twofa(self, user, twofa_code):
        pass
    
    @abstractmethod
    def get_user_from_token(self, token):
        pass
