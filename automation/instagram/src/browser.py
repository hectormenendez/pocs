from json import loads as Parse, dumps as Stringify
from urllib.parse import quote_plus as Quote

from selenium import webdriver as Driver
# from selenium.webdriver.support.ui import WebDriverWait
# from selenium.webdriver.common.keys import Keys

from common import CONF, PATH

URL_BASE = "https://www.instagram.com"

ERROR = "ERROR: {}"
ERROR_NOT_IMPLEMENTED = ERROR.format("Not implemented yet")
ERRROR_EXPECTING = ERROR.format("Expecting {}")

class Bot():

    def __init__(self):
        # Download Chromium from https://sites.google.com/a/chromium.org/chromedriver/home
        self.driver = Driver.Chrome(PATH + "/env/bin/chromedriver")
        # wait for the page load.
        self.driver.implicitly_wait(30)

    def quit(self):
        self.driver.quit()

    def halt(self, message=""):
        print(message)
        self.quit()
        exit()

    def login(self):
        self.driver.get("{}/accounts/login".format(URL_BASE))
        eUser = self.driver.find_element_by_css_selector("form input[name=username]")
        ePass = self.driver.find_element_by_css_selector("form input[name=password]")
        eSend = self.driver.find_element_by_css_selector("form button[type=submit]")

        eUser.send_keys(CONF["user"]["name"])
        ePass.send_keys(CONF["user"]["pass"])
        eSend.click()

        # is there a dialog (probably the notification one) open? close it.
        if self.driver.find_elements_by_css_selector("div[role=dialog]"):
            self.driver.find_element_by_css_selector("div[role=dialog] button:nth-child(2)").click()

    def goto_user(self, username=CONF["user"]["name"]):
        self.driver.get("{}/{}/?__a=1".format(URL_BASE, username))

    def get_media(self, id=False, media=False):
        media = media["node"]
        if not id and not media:
            self.halt(ERRROR_EXPECTING.format("either an id or a media"))
        if id:
            # TODO: Find a way to retrieve a media by id
            self.halt(ERROR_NOT_IMPLEMENTED)
        if not media:
            return {}
        return {
            "id": media["id"],
            "text": media["edge_media_to_caption"]["edges"][0]["node"]["text"],
            "comments": media["edge_media_to_comment"]["count"],
            "likesReal": media["edge_liked_by"]["count"],
            "likesShow": media["edge_media_preview_like"]["count"],
            "isVideo": media["is_video"],
            "pic": media["thumbnail_src"],
            "caption": media["accessibility_caption"],
        }

    def get_json(self, url):
        self.driver.get(url)
        text = self.driver.find_element_by_tag_name("pre").get_attribute("innerHTML")
        return Parse(text)

    def get_user_followers(self, id=False):
        def get_query(vars):
            return (
                "{}/graphql/query/"
                "?query_hash=56066f031e6239f35a904ac20c9f37d9"
                "&variables={}"
            ).format(URL_BASE, Quote(Stringify(vars)))

        json = self.get_json(get_query({
            "id": id,
            "include_reel": False,
            "fetch_mutual": False,
            "first": 9999,
        }))["data"]["user"]["edge_followed_by"]

        followers = []
        for follower in json["edges"]:
            follower = follower["node"]
            followers.append({
                "id": follower["id"],
                "nameFull": follower["full_name"],
                "nameUser": follower["username"],
                "pic": follower["profile_pic_url"],
                "private": follower["is_private"],
                "verified": follower["is_verified"],
            })
        print(followers)
        # TODO: Make a recursive call to get all users according to the value of json["page_info"]

    def get_user(self, username=CONF["user"]["name"]):
        json = self.get_json("{}/{}/?__a=1".format(URL_BASE, username))
        user = json["graphql"]["user"]
        # get medias
        medias = []
        for media in user["edge_owner_to_timeline_media"]["edges"]:
            medias.append(self.get_media(media=media))
        return {
            "id": user["id"],
            "bio": user["biography"],
            "url": user["external_url"],
            "pic": user["profile_pic_url_hd"],
            "nameFull": user["full_name"],
            "nameUser": user["username"],
            "countFollowers": user["edge_followed_by"]["count"],
            "countFolowing": user["edge_follow"]["count"],
            "countMedias": user["edge_owner_to_timeline_media"]["count"],
            "medias": medias,
            "business": False if not user["is_business_account"] else user["business_category_name"],
            "private": user["is_private"],
            "verified": user["is_verified"],
        }


bot = Bot()
bot.login()
user = bot.get_user()
bot.get_user_followers(id=user["id"])
# print(user)
bot.quit()