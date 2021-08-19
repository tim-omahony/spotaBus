from selenium import webdriver
from django.contrib.staticfiles.testing import StaticLiveServerTestCase
from django.urls import reverse
import time


class TestIndexPage(StaticLiveServerTestCase):

    def setUp(self):
        self.driver = webdriver.Chrome(
            "C:/Users/matth/Desktop/Summer/Project code/dublin_busboys/functional_tests/chromedriver.exe")

    def tearDown(self):
        self.driver.quit()

    def test_why_take_bus_hidden(self):
        # user navigates to homepage
        self.driver.get("http://127.0.0.1:8000/about/")
        self.driver.maximize_window()

        #user clicks on link
        link = self.driver.find_element_by_partial_link_text("https://github.com/tim-omahony")
        link.click()

        time.sleep(5)

        #checking user is redirected to github
        self.assertIn("tim-omahony", self.driver.current_url)