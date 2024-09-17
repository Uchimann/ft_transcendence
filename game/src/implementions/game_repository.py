from typing import Tuple, List
from uuid import UUID

from django.db.models import CharField

from ..interface.game_repository import GameRepository
from ..models.models import Game


class GameRepositoryImpl(GameRepository):
    def save_game(self, game: Game) -> Tuple[bool, str]:
        try:
            game.save()
            return True, "Oyun başarıyla kaydedildi"
        except Exception as e:
            return False, str(e)


    def list(self, user_name: CharField) -> Tuple[List[Game], str]:
        try:
            game_list = Game.objects.filter(user_name=user_name)
            return game_list, ""
        except Exception as e:
            return [], str(e)