from typing import Tuple, List
from uuid import UUID

from django.db.models import CharField

from ..interface.game_repository import GameRepository
from ..models.models import Game


class GameRepositoryImpl(GameRepository):
    def save_game(self, game: Game) -> Tuple[bool, str]:
        try:
            new_game = Game()
            new_game.user_name = game.user_two_name
            new_game.user_two_name = game.user_name
            new_game.player_one_score = game.player_two_score
            new_game.player_two_score = game.player_one_score
            game.save()
            new_game.save()
            return True, "Oyun başarıyla kaydedildi"
        except Exception as e:
            return False, str(e)


    def list(self, user_name: CharField) -> Tuple[List[Game], str]:
        try:
            game_list = Game.objects.filter(user_name=user_name)
            return game_list, ""
        except Exception as e:
            return [], str(e)

    def delete(self, game_id: UUID) -> Tuple[bool, str]:
        try:
            game = Game.objects.get(match_id=game_id)
            if game:
                game.delete()
            return True, ""
        except Exception as e:
            return False, str(e)