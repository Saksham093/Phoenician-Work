from django.contrib.auth.models import AbstractUser, Group, Permission
from django.db import models


class Department(models.Model):
    name = models.CharField(max_length=100)
    department_id = models.AutoField(primary_key=True)

    def __str__(self):
        return self.name


class CustomUser(AbstractUser):
    department = models.ForeignKey('Department', on_delete=models.CASCADE, null=True)
    email = models.EmailField(unique=True)
    verification_code = models.CharField(max_length=6, null=True, blank=True)  # New field for code

    # Add related_name attributes to resolve clashes
    groups = models.ManyToManyField(
        Group,
        related_name="customuser_set",  # Custom related_name
        blank=True
    )
    user_permissions = models.ManyToManyField(
        Permission,
        related_name="customuser_permissions_set",  # Custom related_name
        blank=True
    )

    # Use 'first_name' and 'last_name' instead of 'name'
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username', 'department']

    def __str__(self):
        return self.email
