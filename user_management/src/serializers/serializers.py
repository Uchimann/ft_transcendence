from rest_framework import serializers
from src.models.models import User
from django.contrib.auth import authenticate

class CreateUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            'username',
            'first_name',
            'last_name',
            'email',
            'password'
        ]




class UserSerializer(serializers.ModelSerializer):
    friends = serializers.PrimaryKeyRelatedField(many=True, read_only=True)  # Arkadaş ID'leri listesi olarak dönecek

    class Meta:
        model = User
        fields = [
            'id',
            'username',
            'first_name',
            'last_name',
            'email',
            'avatar',
            'is_online',
            'win_count',
            'loss_count',
            'friends',  # Arkadaş ilişkisi
            'created_at',
            'updated_at',
        ]



class LoginSerializer(serializers.Serializer):
    username = serializers.CharField(required=True)
    password = serializers.CharField(required=True)


class TwoFASerializer(serializers.Serializer):
    twofa_code = serializers.CharField(required=True)

    
class UpdateUserSerializer(serializers.ModelSerializer):
    current_username = serializers.CharField(required=True)
    username = serializers.CharField(required=True)
    email = serializers.EmailField(required=True)
    first_name = serializers.CharField(required=True)
    last_name = serializers.CharField(required=True)

    class Meta:
        model = User
        fields = [
            'current_username',
            'username',
            'email',
            'first_name',
            'last_name',
        ]

    def validate_email(self, value):
        current_username = self.initial_data.get('current_username')
        if User.objects.filter(email=value).exclude(username=current_username).exists():
            raise serializers.ValidationError("Email already in use.")
        return value

class UpdateAvatarSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['avatar']
        