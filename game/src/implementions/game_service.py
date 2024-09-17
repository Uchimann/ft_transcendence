from typing import Tuple, List

from ..implementions.game_repository import GameRepositoryImpl
from ..interface.game_service import GameService
from ..models.models import Game


class GameServiceImpl(GameService):
    def __init__(self,**kwargs):
        super().__init__(**kwargs)
        self.game_repository = GameRepositoryImpl()

    def save_game(self, validated_data: dict) -> Tuple[bool, str]:
        game = Game(**validated_data)
        success, message = self.game_repository.save_game(game)
        if success:
            return True, "Oyun başarıyla kaydedildi"
        return False, message

    def list_games(self, user_name) -> Tuple[List[Game], str]:
        game_list, message =  self.game_repository.list(user_name)
        if game_list:
            return game_list, message
        return [], message