import uuid
from enum import unique

from django.contrib.auth.hashers import make_password, check_password
from django.db import models


class User(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    username = models.CharField(unique=True, max_length=100)
    password = models.CharField(null=True, max_length=128)
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def hash_password(self, raw_password):
        self.password = make_password(raw_password)

