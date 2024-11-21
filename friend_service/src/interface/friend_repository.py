import uuid
from abc import abstractmethod
from typing import Tuple, List
from django.db import models

from ..models.models import Friend


class FriendRepository:
    @abstractmethod
    def add_friend(self, friendship_req : Friend):
        pass

    @abstractmethod
    def list_friends(self, user_id: uuid.UUID) -> Tuple[models.QuerySet, str]:
        pass
