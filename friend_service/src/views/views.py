from rest_framework import viewsets, status
from rest_framework.response import Response

from ..implementions.friend_repository import FriendRepositoryImpl
from ..implementions.friend_service import FriendServiceImpl
from ..serializers.serializers import FriendSerializer


class FriendServiceHandler(viewsets.ViewSet):
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.service = FriendServiceImpl(FriendRepositoryImpl())

    def add_as_friend(self, request):
        serializer = FriendSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors ,status=status.HTTP_400_BAD_REQUEST)

        result, message = self.service.add_friend(serializer.validated_data)
        if message:
            return Response(message, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        return Response(result, status=status.HTTP_200_OK)

    def get_friend_list(self, request):
        user_id = request.query_params.get('user_id')
        if not user_id:
            return Response("user_id is required",status=status.HTTP_400_BAD_REQUEST)
        friends, message = self.service.get_friend_list(user_id)
        if message:
            return Response(message, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        serializers = FriendSerializer(instance=friends, many=True)
        return Response(serializers.data, status=status.HTTP_200_OK)


