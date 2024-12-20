from django.core.mail import send_mail
from django.urls import reverse
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import CustomUser
from .serializers import RegisterSerializer
from .utils import email_verification_token

from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import CustomUser
from .utils import email_verification_token

from django.contrib.auth import authenticate, login
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.conf import settings
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from django.contrib.auth.tokens import default_token_generator

import random

class RegisterView(APIView):
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            user.is_active = False  # Deactivate account until it is verified
            user.save()

            # Generate token
            token = email_verification_token.make_token(user)
            verification_url = request.build_absolute_uri(
                reverse('email-verify', args=[user.pk, token])
            )

            try:

                # Generate a 6-digit verification code
                verification_code = random.randint(100000, 999999)
                user.verification_code = verification_code  # Save the code to the user model
                user.save()

                # Send the code via email
                send_mail(
                    'Email Verification Code',
                    f'Your verification code is: {verification_code}',
                    'your_email@example.com',  # Your email (from)
                    [user.email],  # User's email (to)
                    fail_silently=False,
                )
            except Exception as e:
                print(f"Error sending email: {e}")
                return Response({"error": "Email sending failed"}, status=500)


            return Response(
                {"message": "User registered successfully. Please check your email for the verification code."},
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class EmailVerifyView(APIView):
    def get(self, request, user_id, token):
        user = get_object_or_404(CustomUser, pk=user_id)
        if email_verification_token.check_token(user, token):
            user.is_active = True
            user.save()
            return Response({"message": "Email verified successfully"}, status=200)
        return Response({"message": "Invalid or expired token"}, status=400)


# class LoginView(APIView):
#     def post(self, request):
#         email = request.data.get('email')
#         password = request.data.get('password')
#         remember_me = request.data.get('rememberMe')  # Get the "Remember Me" value from the frontend

#         user = authenticate(request, username=email, password=password)

#         if user is not None:
#             # Check if the user's email is verified
#             if not user.is_active:
#                 return Response({"message": "Please verify your email before logging in."}, status=status.HTTP_403_FORBIDDEN)

#             login(request, user)

#             # Set session expiry based on "Remember Me"
#             if remember_me:
#                 # Keep the session active for 2 weeks
#                 request.session.set_expiry(1209600)  # 2 weeks in seconds
#             else:
#                 # Expire the session when the browser is closed
#                 request.session.set_expiry(0)

#             return Response({
#                 "message": "Login successful",
#                 "department": user.department.id  # Assuming department has an ID
#             }, status=status.HTTP_200_OK)
#         else:
#             return Response({"message": "Invalid email or password"}, status=status.HTTP_401_UNAUTHORIZED)


class LoginView(APIView):
    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')
        remember_me = request.data.get('rememberMe')  # Get the "Remember Me" value from the frontend

        # Debug: Print email and password (for testing purposes only, remove in production)
        print("Email:", email)
        print("Password:", password)

        user = authenticate(request, username=email, password=password)

        # Debug: Check if the user object is None
        print("Authenticated User:", user)

        if user is not None:
            # Check if the user's email is verified
            if not user.is_active:
                return Response({"message": "Please verify your email before logging in."}, status=status.HTTP_403_FORBIDDEN)

            login(request, user)

            # Set session expiry based on "Remember Me"
            if remember_me:
                # Keep the session active for 2 weeks
                request.session.set_expiry(1209600)  # 2 weeks in seconds
            else:
                # Expire the session when the browser is closed
                request.session.set_expiry(0)

            return Response({
                "message": "Login successful",
                "department": user.department.id  # Assuming department has an ID
            }, status=status.HTTP_200_OK)
        else:
            return Response({"message": "Invalid email or password"}, status=status.HTTP_401_UNAUTHORIZED)



class VerifyCodeView(APIView):
    def post(self, request):
        email = request.data.get('email')
        code = request.data.get('code')
        user = CustomUser.objects.filter(email=email, verification_code=code).first()

        if user:
            user.is_active = True  # Activate the user account
            user.verification_code = None  # Clear the code after verification
            user.save()
            return Response({"message": "Email verified successfully!", "success": True}, status=status.HTTP_200_OK)
        else:
            return Response({"message": "Invalid verification code.", "success": False}, status=status.HTTP_400_BAD_REQUEST)
