# models.py

import uuid
from django.contrib.auth.hashers import make_password
from django.db import models
from django.utils import timezone

class User(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    username = models.CharField(unique=True, max_length=100)
    password = models.CharField(null=True, max_length=128)
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    avatar = models.ImageField(upload_to='avatars/', default='default_avatar.jpg')#yeni
    friends = models.ManyToManyField('self', symmetrical=False, related_name='user_friends')#yeni
    is_online = models.BooleanField(default=False)#yeni
    last_hearbeat = models.DateTimeField(default=timezone.now)#yeni
    win_count = models.IntegerField(default=0)#yeni
    loss_count = models.IntegerField(default=0)#yeni
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    twofa_code = models.CharField(max_length=10, null=True)
    twofa_code_expiry = models.DateTimeField(null=True)

    def hash_password(self, raw_password):
        self.password = make_password(raw_password)
