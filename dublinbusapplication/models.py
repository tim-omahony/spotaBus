from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager


class Stop(models.Model):
    stop_id = models.CharField(max_length=200)
    stop_name = models.CharField(max_length=200)
    stop_lat = models.FloatField()
    stop_lon = models.FloatField()

    def to_json(self):
        return dict(stop_id=self.stop_id, stop_name=self.stop_name, stop_lat=self.stop_lat, stop_lon=self.stop_lon)


class Weather(models.Model):
    description = models.CharField(max_length=250)
    temp = models.FloatField()
    last_update = models.DateTimeField()


class Bikes(models.Model):
    Number = models.IntegerField()
    Name = models.CharField(max_length=250)
    Address = models.CharField(max_length=250)
    Latitude = models.FloatField()
    Longitude = models.FloatField()


class UserManager(BaseUserManager):
    def create_user(self, email, username, password=None):
        if not email:
            raise ValueError("User must have an email")
        if not username:
            raise ValueError("User must have an username")
        # creating user
        user = self.model(
            email=self.normalize_email(email),  # making the email input lowercase to the database
            username=username,
        )
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, username, password):
        user = self.create_user(
            email=self.normalize_email(email),  # making the email input lowercase to the database
            password=password,
            username=username,
        )
        user.is_admin = True
        user.is_staff = True
        user.is_superuser = True
        user.save(using=self._db)
        return user


class User(AbstractBaseUser):
    email = models.EmailField(verbose_name='email', max_length=60, unique=True)
    # fields underneath are required to build a custom form
    username = models.CharField(max_length=30, unique=True)
    date_joined = models.DateTimeField(verbose_name='date joined', auto_now_add=True)
    last_login = models.DateTimeField(verbose_name='last login', auto_now_add=True)
    is_admin = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ['email']

    objects = UserManager()

    # to string to display username
    def str(self):
        return self.username

    def has_perm(self):
        return self.is_admin

    def has_module_perms(self):
        return True
