from rest_framework import serializers
from django.contrib.auth.models import User
import re
from .models import Storage


class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('username', 'password', 'first_name', 'last_name', 'email', 'is_superuser', 'is_active', 'is_staff')
        extra_kwargs = {
            'password': {'write_only': True}
        }


    def validate(self, data):

        password = data['password']
        email = data['email']
        username = data['username']
        first_name = data['first_name']
        last_name = data['last_name']

        if not all([username, password, email, first_name, last_name]):
            raise serializers.ValidationError({'error': 'Все поля обязательны.'})

        if not password:
            raise serializers.ValidationError('Not found password')
        if len(password) < 6:
            raise serializers.ValidationError('Password to short')
        if not re.search(r'\d', password):
            raise serializers.ValidationError({'error': 'Password must contain at least one number'})
        if not re.search(r'[A-Z]', password):
            raise serializers.ValidationError('Password must contain at least one uppercase letter')
        if not re.search(r'[!@#$%^&*()_+\-=\[\]{};:\'",.<>/?`~]', password):
            raise serializers.ValidationError('Password must contain at least one special symbol')

        regex = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        if not re.fullmatch(regex, email):
            raise serializers.ValidationError({'email_error': 'Неправильный email'})

        if not (4 <= len(username) <= 20):
            raise serializers.ValidationError({'username_error': 'Long of username is not right.'})
        if not username[0].isalpha():
            raise serializers.ValidationError({'username_error': 'First letter must be a letter.'})
        if not username.isalnum():
            raise serializers.ValidationError({'username_error': 'All characters are alphanumeric'})

        return data

    def create(self, validated_data):
        instance = User.objects.create(**validated_data)
        instance.set_password(validated_data['password'])
        instance.save()
        return instance


""" Admin Area Serializer"""
class UserSerializer(serializers.ModelSerializer):
    size = serializers.IntegerField(read_only=True)
    count = serializers.IntegerField(read_only=True)
    class Meta:
        model = User
        fields = ('id', 'username', 'password', 'first_name', 'last_name', 'email',
                  'is_superuser', 'is_active', 'is_staff', 'size', 'count');
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def create(self, validated_data):
        instance = User.objects.create(**validated_data)
        instance.set_password(validated_data['password'])
        instance.save()
        return instance


class StorageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Storage
        fields = '__all__'
        read_only_fields = ('id,','uploaded_at','owner_id')


class UserFilesSerializator(serializers.ModelSerializer):
    class Meta:
        model = Storage
        fields = ['id', 'file', 'description', 'original_name', 'owner', 'uploaded_at', 'secret_name']
        read_only_fields = ('id','owner_id','uploaded_at', 'owner')