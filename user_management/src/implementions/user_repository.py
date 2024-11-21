from abc import ABC
from typing import Tuple, List
from uuid import UUID
from venv import logger


from src.interface.user_repository import UserRepository
from src.models.models import User
import json

class UserRepositoryImpl(UserRepository):
    def get_by_id(self, id: UUID) -> Tuple[User, str]:
        try:
            model = User.objects.filter(id=id).first()
            if model:
                return model, ""
            return None, "User not found"
        except Exception as e:
            return None, str(e)

    def create(self, user: User) -> Tuple[bool, str]:
        try:
            user.save()
            return True, ""
        except Exception as e:
            return False, str(e)

    def delete_user(self, user_id: UUID) -> Tuple[bool, str]:
        try:
            model = User.objects.filter(id=user_id).first()
            if model:
                model.delete()
                return True, ""
            return False, "User not found"
        except Exception as e:
            return False, str(e)

    def get_all(self) -> Tuple[List[User], str]:
        try:
            return User.objects.all(), ""
        except Exception as e:
            return [], str(e)

    def get_by_username(self, username: str) -> Tuple[User, str]:
        try:
            model = User.objects.filter(username=username).first()
            if model:
                return model, ""
            return None, "User not found"
        except Exception as e:
            return None, str(e)

    def get_by_email(self, email: str) -> Tuple[User, str]:
        try:
            model = User.objects.filter(email=email).first()
            if model:
                return model, ""
            return None, "User not found"
        except Exception as e:
            return None, str(e)
        
    def update_user(self, validated_data: dict) -> Tuple[bool, str]: #eozdur
        try:
            current_username = validated_data['current_username'] # Mevcut kullanıcı adını al
            username = validated_data['username'] # Yeni kullanıcı adını al
            
            # Kullanıcıyı current_username ile bul
            user = User.objects.filter(username=current_username).first() # 
            if user:
                # Eğer yeni username mevcutsa ve farklıysa kontrol et
                if username != current_username and User.objects.filter(username=username).exists():
                    return False, "New username already exists"
                
                # Kullanıcı bilgilerini güncelle
                user.username = username  # Yeni kullanıcı adını güncelleyebilirsiniz
                user.first_name = validated_data['first_name'] 
                user.last_name = validated_data['last_name']
                user.email = validated_data['email']
                user.save() # Kullanıcıyı kaydet
                return True, ""
            
            return False, "User not found"
        except Exception as e:
            return False, f"Error: {str(e)}"
    
    def update_avatar(self, user, avatar_file):
        try:
            user.avatar = avatar_file
            user.save()
            return True, "Avatar updated successfully."
        except Exception as e:
            return False, f"Error updating avatar: {str(e)}"
    