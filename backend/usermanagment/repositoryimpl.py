from abc import ABC
from contextlib import nullcontext
from typing import Tuple, Any

from django.core.cache import cache
from django.db.models import UUIDField
from django.forms import BooleanField

from transandancefirst.usermanagment.interface.repository import UserRepository
from transandancefirst.usermanagment.models import UserManagement


class UserRepositoryImpl(UserRepository, ABC):

    def get_by_id(self, id: int) -> tuple[UserManagement, str] :
        try:
            model = UserManagement.objects.filter(id=id).first()
            return model,""
        except Exception as e:
            return None,str(e)

    def create_user(self, user : UserManagement) -> Tuple[BooleanField,str]:
        try:
            user.save()
            return Tuple[True,nullcontext]
        except Exception as e:
            return False, str(e)

    def delete_user(self, id : UUIDField) -> Tuple[BooleanField,str]:
        try:
            model = UserManagement.objects.filter(id=id).first().delete()
            return Tuple[True,nullcontext]
        except Exception as e:
            return False, str(e)

    def get_all(self):
        try :
            model = UserManagement.objects.all()
            return model
        except  Exception as e:
            return nullcontext

    def get_by_username(self, username: str) -> Tuple[UserManagement, str]:
        try :
            model = UserManagement.objects.filter(username=username).first()
            return model,""
        except Exception as e:
            return None,str(e)

    def get_by_email(self, email: str) -> Tuple[UserManagement, str]:
        try:
            model = UserManagement.objects.filter(email=email).first()
            return model,""
        except Exception as e:
            return None,str(e)
