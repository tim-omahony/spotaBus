from django.urls import path
from . import views

urlpatterns = [
    path('', views.index),
    path('stops/', views.stops),
    path('about/', views.about),
    path('contact/', views.contact),
    path('search_test/', views.search_test)
]
