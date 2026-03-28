import os
from django.db import models
from django.contrib.auth.models import User
import uuid


# Create your models here.

# Папка для хранения файлов.

def user_directory_path(instance, filename):
    # путь к файлу storage/user_id/filename
    return os.path.join('files', str(instance.owner.id), filename)

def get_secret_name():
    my_uuid = uuid.uuid4()
    return str(my_uuid)

def get_original_name(instance, filename):
    pass

# Создаем модель для хранения файлов.
class Storage(models.Model):
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='files')
    original_name = models.CharField(max_length=255)
    secret_name = models.CharField(max_length=255, default=get_secret_name)
    description = models.TextField(blank=True, null=True)
    file = models.FileField(upload_to=user_directory_path)
    uploaded_at = models.DateTimeField(auto_now_add=True)
    downloaded_at = models.DateTimeField(null=True)
    size = models.IntegerField(null=True)

    def __str__(self):
        return f"{self.owner.username}/{self.original_name}"

    class Meta:
        # уникальное имя файла в пределах папки пользователя.
        constraints = [models.UniqueConstraint(fields=['owner', 'original_name'], name='unique_filename_per_user')]