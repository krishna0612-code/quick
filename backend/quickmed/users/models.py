

# from django.db import models
# from django.contrib.auth.models import AbstractUser

# USER_TYPES = (
#     ("user", "User"),
#     ("vendor", "Vendor"),
#     ("delivery", "Delivery"),
#     ("doctor", "Doctor"),
# )

# class CustomUser(AbstractUser):
#     full_name = models.CharField(max_length=200)
#     email = models.EmailField(unique=True)
#     phone = models.CharField(max_length=15, unique=True)
#     user_type = models.CharField(max_length=20, choices=USER_TYPES)

#     username = None
#     USERNAME_FIELD = "email"
#     REQUIRED_FIELDS = []

#     # permission fixes
#     groups = models.ManyToManyField(
#         "auth.Group",
#         related_name="customuser_groups",
#         blank=True
#     )
#     user_permissions = models.ManyToManyField(
#         "auth.Permission",
#         related_name="customuser_permissions",
#         blank=True
#     )

#     def __str__(self):
#         return f"{self.full_name} - {self.email} ({self.user_type})"


# # --- PROFILES ---

# class UserProfile(models.Model):
#     user = models.OneToOneField(CustomUser, on_delete=models.CASCADE)

#     def __str__(self):
#         return f"User: {self.user.full_name} ({self.user.email})"


# class VendorProfile(models.Model):
#     user = models.OneToOneField(CustomUser, on_delete=models.CASCADE)
#     shop_name = models.CharField(max_length=200, blank=True, null=True)
#     gst_number = models.CharField(max_length=20, blank=True, null=True)

#     def __str__(self):
#         return f"Vendor: {self.user.full_name} ({self.user.email})"


# class DeliveryProfile(models.Model):
#     user = models.OneToOneField(CustomUser, on_delete=models.CASCADE)
#     vehicle_number = models.CharField(max_length=50, blank=True, null=True)
#     area = models.CharField(max_length=100, blank=True, null=True)

#     def __str__(self):
#         return f"Delivery Boy: {self.user.full_name} ({self.user.email})"


# class DoctorProfile(models.Model):
#     user = models.OneToOneField(CustomUser, on_delete=models.CASCADE)
#     specialization = models.CharField(max_length=200, blank=True, null=True)
#     license_number = models.CharField(max_length=200, blank=True, null=True)

#     def __str__(self):
#         return f"Doctor: {self.user.full_name} ({self.user.email})"




from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager


USER_TYPES = (
    ("user", "User"),
    ("vendor", "Vendor"),
    ("delivery", "Delivery"),
    ("doctor", "Doctor"),
)


class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError("Email is required")
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        return self.create_user(email, password, **extra_fields)


class CustomUser(AbstractUser):
    full_name = models.CharField(max_length=200)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=15, unique=True)
    user_type = models.CharField(max_length=20, choices=USER_TYPES)

    username = None
    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []

    objects = CustomUserManager()

    groups = models.ManyToManyField("auth.Group", related_name="customuser_groups", blank=True)
    user_permissions = models.ManyToManyField("auth.Permission", related_name="customuser_permissions", blank=True)

    def __str__(self):
        return f"{self.full_name} - {self.email} ({self.user_type})"


class UserProfile(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE)


class VendorProfile(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE)


class DeliveryProfile(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE)


class DoctorProfile(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE)
