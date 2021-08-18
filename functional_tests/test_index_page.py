from selenium import webdriver
from django.contrib.staticfiles.testing import StaticLiveServerTestCase
from django.urls import reverse
import time

class TestIndexPage(StaticLiveServerTestCase):

    def setUp(self):
        self.browser = webdriver.Chrome('functional_tests/chromedriver.exe')

    def tearDown(self):
        self.browser.close()

    def test_holiday_div_not_displayed(self):
        self.browser.get(self.live_server_url)

        # User arrives on page for first time
        alert = self.browser.find_element_by_id("holidayWidget")
        self.assertEqual(
            alert.text,""
        )

    def test_modal_displays_on_click(self):
        self.browser.get(self.live_server_url)

        # User arrives on page for first time
        self.browser.find_element_by_id("planButton").click()


    def test_github_redirects(self):
        self.browser.get(self.live_server_url)

        # User arrives on page for first time
        self.browser.find_element_by_id("planButton").click()
