import time
from locust import HttpUser, task, between

class SiteUser(HttpUser):

    #randomizing wait time to simulate user flow
    wait_time = between(1, 5)

    #tasks for all website pages
    @task
    def home_page(self):
        self.client.get(url ='')

    @task
    def about_page(self):
        self.client.get(url='about')

    @task
    def contact_page(self):
        self.client.get(url='contact')

    @task
    def register_page(self):
        self.client.get(url='register')

    @task
    def login_page(self):
        self.client.get("login")
