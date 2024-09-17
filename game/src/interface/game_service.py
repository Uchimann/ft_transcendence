from abc import abstractmethod
from typing import Tuple, List

from django.db.models import CharField

from ..models.models import Game


class GameService:
    @abstractmethod
    def save_game(self, validated_data : dict):
        pass
    def list_games(self, user_name) -> Tuple[List[Game], str]:
        pass