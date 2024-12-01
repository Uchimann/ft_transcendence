import uuid
from enum import unique

from rest_framework import serializers

from ..models.models import Friend

class FriendSerializer(serializers.ModelSerializer):
    class Meta:
        model = Friend
        fields = [
            'user_id',
            'second_user_id',
        ]





















