import uuid
from typing import List

from django.db import models

class Friend(models.Model):
    user_id = models.UUIDField()
    second_user_id = models.UUIDField()
