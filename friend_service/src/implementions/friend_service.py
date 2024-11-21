import uuid
from typing import Tuple, List

from ..implementions.friend_repository import FriendRepositoryImpl
from ..interface.friend_service import FriendService
from ..models.models import Friend


class FriendServiceImpl(FriendService):
    def __init__(self, repository : FriendRepositoryImpl):
        self.repository = repository

    def add_friend(self, validated_data : dict):
        friendship_req = Friend(**validated_data)
        return self.repository.add_friend(friendship_req)

    def get_friend_list(self, user_id: uuid.UUID) -> Tuple[List[Friend], str]:
        return self.repository.list_friends(user_id)

