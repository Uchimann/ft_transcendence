import uuid

from django.db import models

class Game(models.Model):
    match_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    player_one_score = models.IntegerField(default=0)
    player_two_score = models.IntegerField(default=0)
    user_name = models.CharField(max_length=50)
    match_date = models.DateTimeField(auto_now_add=True)

