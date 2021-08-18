from django.urls import path
from . import views
from .views import *

urlpatterns = [
    path('', index, name="home"),
    path('about/', views.about),
    path('contact/', views.contact),
    path('login/', views.login_page, name="login"),
    path('logout/', views.logout_user, name="logout"),
    path('register/', views.register_page, name="register"),
    path('predict/', predict, name='predict'),
    path('add_favourite_route/', add_favourite_route, name="add_favourite_route"),
    path('dist/', distance, name='distance'),
    path('delete_fav_route/', DisplayFavRoute.as_view(), name='deleteUserFavJourney'),
    path('delete_fav_route/delete_user/', views.del_user, name='deleteuser'),
]
