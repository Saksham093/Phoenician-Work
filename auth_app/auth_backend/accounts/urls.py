from django.urls import path
from .views import RegisterView, LoginView, VerifyCodeView, EmailVerifyView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('email-verify/<int:user_id>/<str:token>/', EmailVerifyView.as_view(), name='email-verify'),
    path('login/', LoginView.as_view(), name='login'),
    path('verify-code/', VerifyCodeView.as_view(), name='verify-code'),
]
