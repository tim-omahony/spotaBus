from django.db import models


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
