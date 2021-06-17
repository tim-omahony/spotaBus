from django.contrib import admin
from .models import Buses


class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'price')


admin.site.register(Buses, ProductAdmin)
