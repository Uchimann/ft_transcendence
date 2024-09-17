from abc import abstractmethod
from typing import Tuple, List
from uuid import UUID

from django.db.models import UUIDField, CharField

from ..models.models import Game


class GameRepository:
    def __init__(self):
        super().__init__()

    @abstractmethod
    def save_game(self, game: Game) -> Tuple[bool,str]:
        pass

    @abstractmethod
    def list(self, user_name: CharField) -> Tuple[List[Game], str]:
        pass