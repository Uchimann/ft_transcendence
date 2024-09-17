import uuid
from uuid import UUID

from django.shortcuts import render
from rest_framework import viewsets, status
from rest_framework.response import Response

from src.implementions.auth_repository import AuthRepositoryImpl
from src.implementions.auth_service import AuthServiceImpl
from src.implementions.user_repository import UserRepositoryImpl
from src.implementions.user_service import UserServiceImpl
from src.serializers.serializers import UserSerializer, CreateUserSerializer, \
    LoginSerializer


class AuthHandler(viewsets.ViewSet):
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.service = AuthServiceImpl(AuthRepositoryImpl())

    def login(self, request):
        serializer = LoginSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        token, success = self.service.login(serializer.validated_data)
        if success:
            return Response({'token': token}, status=status.HTTP_200_OK)
        return Response({'error': token}, status=status.HTTP_400_BAD_REQUEST)

    def validate_token(self, request):
        token = request.query_params.get('token')
        if not token:
            return Response({'error': 'Token is missing'}, status=status.HTTP_400_BAD_REQUEST)
        result, message = self.service.validate_token(token)
        if result:
            return Response({'token': token, 'message': message}, status=status.HTTP_200_OK)

        return Response({'error': message}, status=status.HTTP_401_UNAUTHORIZED)


class UserManagementHandler(viewsets.ViewSet):

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.service = UserServiceImpl(UserRepositoryImpl())

    def get_user_by_id(self, request):
        user_id = request.query_params.get('id')
        if not user_id:
            return Response({'error': 'User id is required'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            if not uuid.UUID(user_id):
                return Response({'error': 'Invalid user ID format. Please provide a valid UUID.'},
                                status=status.HTTP_400_BAD_REQUEST)
        except ValueError:
            return Response({'error': 'Invalid user ID format. Please provide a valid UUID.'},
                            status=status.HTTP_400_BAD_REQUEST)
        user, message = self.service.get_user_by_id(UUID(user_id))
        if user:
            serializer = UserSerializer(user)
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response({'error': message}, status=status.HTTP_404_NOT_FOUND)

    def get_user_by_username(self, request):
        username = request.query_params.get('username')
        if not username:
            return Response({'error': 'Username is required'}, status=status.HTTP_400_BAD_REQUEST)
        user, message = self.service.get_user_by_username(username)
        if user:
            serializer = UserSerializer(user)
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response({'error': message}, status=status.HTTP_404_NOT_FOUND)

    def get_user_by_email(self, request):
        email = request.query_params.get('email')
        if not email:
            return Response({'error': 'Email is required'}, status=status.HTTP_400_BAD_REQUEST)

        user, message = self.service.get_user_by_email(email)
        if user:
            serializer = UserSerializer(user)
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response({'error': message}, status=status.HTTP_404_NOT_FOUND)

    def create_user(self, request):
        serializer = CreateUserSerializer(data=request.data)
        if not serializer.is_valid():
            return Response({'error': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

        success, message = self.service.create_user(serializer.validated_data)
        if success:
            return Response({'message': 'User created successfully'}, status=status.HTTP_201_CREATED)
        return Response({'error': message}, status=status.HTTP_400_BAD_REQUEST)

    def delete_user(self, request):
        user_id = request.query_params.get('id')
        if not user_id:
            return Response({'error': 'User id is required'}, status=status.HTTP_400_BAD_REQUEST)

        success, message = self.service.delete_user(UUID(user_id))
        if success:
            return Response({'message': 'User deleted successfully'}, status=status.HTTP_200_OK)
        return Response({'error': message}, status=status.HTTP_400_BAD_REQUEST)

    def list_users(self, request):
        user_list, message = self.service.get_all_users()
        if user_list:
            serializer = UserSerializer(user_list, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response({'message': "Not Found"}, status=status.HTTP_404_NOT_FOUND)

from django.http import HttpResponse

from django.shortcuts import render

def index(request):
    return render(request, 'index.html')

def login(request):
    return render(request, 'login/login.html')

def register(request):
    return render(request, 'register/register.html')

# Diğer view fonksiyonları
