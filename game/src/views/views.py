from rest_framework import viewsets, status
from rest_framework.response import Response
from ..implementions.game_service import GameServiceImpl
from ..serializers.serializers import GameSerializer, CreateGameSerializer


class GameHandler(viewsets.ViewSet):
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.service = GameServiceImpl()

    def get_game_list(self, request):
        user_name = request.query_params.get('user_name')
        if not user_name:
            return Response({'error': 'User name is required'}, status=status.HTTP_400_BAD_REQUEST)

        result, message = self.service.list_games(user_name)
        if message:
            return Response({'error': message}, status=status.HTTP_400_BAD_REQUEST)
        if not result:
            return Response({'error': 'No games found'}, status=status.HTTP_404_NOT_FOUND)

        serializer = GameSerializer(result, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def save_game(self, request):
        serializer = CreateGameSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        success, message = self.service.save_game(serializer.validated_data)
        if not success:
            return Response({'error': message}, status=status.HTTP_400_BAD_REQUEST)
        return Response({'message': 'Success'}, status=status.HTTP_200_OK)
