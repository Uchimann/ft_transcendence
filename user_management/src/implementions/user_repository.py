from abc import ABC
from typing import Tuple, List
from uuid import UUID


from src.interface.user_repository import UserRepository
from src.models.models import User

class UserRepositoryImpl(UserRepository):
    def get_by_id(self, id: UUID) -> Tuple[User, str]:
        try:
            model = User.objects.filter(id=id).first()
            if model:
                return model, ""
            return None, "User not found"
        except Exception as e:
            return None, str(e)

    def create(self, user: User) -> Tuple[bool, str]:
        try:
            user.save()
            return True, ""
        except Exception as e:
            return False, str(e)

    def delete_user(self, user_id: UUID) -> Tuple[bool, str]:
        try:
            model = User.objects.filter(id=user_id).first()
            if model:
                model.delete()
                return True, ""
            return False, "User not found"
        except Exception as e:
            return False, str(e)

    def get_all(self) -> Tuple[List[User], str]:
        try:
            return User.objects.all(), ""
        except Exception as e:
            return [], str(e)

    def get_by_username(self, username: str) -> Tuple[User, str]:
        try:
            model = User.objects.filter(username=username).first()
            if model:
                return model, ""
            return None, "User not found"
        except Exception as e:
            return None, str(e)

    def get_by_email(self, email: str) -> Tuple[User, str]:
        try:
            model = User.objects.filter(email=email).first()
            if model:
                return model, ""
            return None, "User not found"
        except Exception as e:
            return None, str(e)
