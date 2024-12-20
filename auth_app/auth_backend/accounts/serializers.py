from rest_framework import serializers
from .models import CustomUser

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = CustomUser
        fields = ['first_name', 'last_name', 'email', 'password', 'department']

    # def validate_email(self, value):
    #     if not value.endswith('@saksham.com'):
    #         raise serializers.ValidationError("Email must be in the format 'name@saksham.com'")
    #     return value

    def create(self, validated_data):
        # Generate a default username if not provided
        username = validated_data.get('email').split('@')[0]  # Use the part before @ as the username
        user = CustomUser.objects.create_user(
            username=username,
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
            email=validated_data['email'],
            password=validated_data['password'],
            department=validated_data['department']
        )
        user.is_active = False  # Deactivate account until it is verified
        user.save()
        return user
