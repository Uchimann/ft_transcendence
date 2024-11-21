from rest_framework import serializers

from ..models.models import Game


class CreateGameSerializer(serializers.ModelSerializer):
    class Meta:
        model = Game
        fields = [
            'player_one_score',
            'player_two_score',
            'user_name',
            'user_two_name'
        ]


class GameSerializer(serializers.ModelSerializer):
    class Meta:
        model = Game
        fields = [
            'match_id',
            'player_one_score',
            'player_two_score',
            'user_name',
            'user_two_name',
            'match_date'
        ]
