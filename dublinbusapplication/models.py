from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from django.contrib.auth import get_user_model
from django.conf import settings


class Stop(models.Model):
    stop_id = models.CharField(max_length=200)
    stop_name = models.CharField(max_length=200)
    stop_lat = models.FloatField()
    stop_lon = models.FloatField()

    def to_json(self):
        return dict(stop_id=self.stop_id, stop_name=self.stop_name, stop_lat=self.stop_lat, stop_lon=self.stop_lon)


class Bikes(models.Model):
    Number = models.IntegerField()
    Name = models.CharField(max_length=250)
    Address = models.CharField(max_length=250)
    Latitude = models.FloatField()
    Longitude = models.FloatField()

#using djangos built in manager class
class UserManager(BaseUserManager):
    #creates a user with email username and password
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
        #saving the user in the db
        user.set_password(password)
        user.save(using=self._db)
        return user
    #function to create a superuser with special permissions
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

#class to create a customer user model with django
class user(AbstractBaseUser):
    #fields assosciated with each user
    email = models.EmailField(verbose_name='email', max_length=60, unique=True)
    # fields underneath are required to build a custom form
    username = models.CharField(max_length=30, unique=True)
    date_joined = models.DateTimeField(verbose_name='date joined', auto_now_add=True)
    last_login = models.DateTimeField(verbose_name='last login', auto_now_add=True)
    is_admin = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)
    total_distance_travelled = models.FloatField(default=0)
    total_trips_planned = models.IntegerField(default=0)

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


# this class takes the user's origin and destination stops, the user and the username and returns them as a string
class FavouriteJourney(models.Model):
    users_origin_stop = models.CharField(max_length=200)
    users_dest_stop = models.CharField(max_length=200)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    username = models.CharField(max_length=200)

    def __str__(self):
        return f"Route: {self.users_origin_stop} to stop {self.users_dest_stop}"

# Used to store overall user metrics that are displayed on the user account page
class UserAccountMetrics(models.Model):
    total_distance_planned = models.FloatField(default=0)
    total_trips_planned = models.IntegerField(default=0)
    username = models.CharField(max_length=200)
