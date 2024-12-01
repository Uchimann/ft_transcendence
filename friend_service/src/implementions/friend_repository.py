import uuid
from typing import Tuple, List

from ..interface.friend_repository import FriendRepository
from django.db import models
from ..models.models import Friend


class FriendRepositoryImpl(FriendRepository):
    def __init__(self):
        pass

    def add_friend(self, friendship_req: Friend):
        try:
            if not Friend.objects.filter(user_id=friendship_req.user_id, second_user_id = friendship_req.second_user_id).first():
                model = Friend(user_id=friendship_req.user_id, second_user_id = friendship_req.second_user_id)
                model2 = Friend(user_id=friendship_req.second_user_id, second_user_id = friendship_req.user_id)
                model.save()
                model2.save()
                return True, ""
            else:
                return False, ""
        except Exception as e:
            return False, str(e)

    def list_friends(self, user_id: uuid.UUID) -> Tuple[models.QuerySet, str]:
        try:
            friends = Friend.objects.filter(user_id=user_id).all()
            return friends, ""
        except Exception as e:
            return Friend.objects.none(), str(e)  # Boş bir QuerySet döndür