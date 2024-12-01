import uuid
from abc import abstractmethod
from typing import List, Tuple

from ..models.models import Friend


class FriendService:
    @abstractmethod
    def add_friend(self, validated_data : dict):
        pass

    @abstractmethod
    def get_friend_list(self, user_id : uuid.UUID) -> Tuple[List[Friend], str]:
        pass
