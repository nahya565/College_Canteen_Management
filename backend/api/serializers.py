from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import MenuItem, Order, Review

User = get_user_model()

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'phone', 'role')
        read_only_fields = ('role',)

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('username', 'email', 'phone', 'password')

    def validate_email(self, value):
        return value


    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['email'],   # Use email as username
            email=validated_data['email'],
            phone=validated_data.get('phone', ''),
            password=validated_data['password'],
            role='student'
        )# Default registered users are students
        
        return user

class MenuItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = MenuItem
        fields = '__all__'

class OrderSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    email = serializers.CharField(source='user.email', read_only=True)

    class Meta:
        model = Order
        fields = ('id', 'user', 'username', 'email', 'items_json', 'subtotal', 'gst', 'grand_total', 'status', 'created_at', 'updated_at')
        read_only_fields = ('user', 'username', 'email')

class ReviewSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model = Review
        fields = ('id', 'user', 'username', 'rating', 'comment', 'created_at')
        read_only_fields = ('user', 'username')
