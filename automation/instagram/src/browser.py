# python libs
from time import sleep as Sleep
# virtualenv libs
from json import loads as Parse, dumps as Stringify
from urllib.parse import quote_plus as Quote
from selenium import webdriver as Driver
# local libs
from common import CONF, PATH

URL_BASE = "https://www.instagram.com"
URL_QUERY = URL_BASE + "/graphql/query/?query_hash={}&variables={}"

ERROR = "ERROR: {}"
ERROR_NOT_IMPLEMENTED = ERROR.format("Not implemented yet")
ERRROR_EXPECTING = ERROR.format("Expecting {}")

class Bot():

    def __init__(self, throttle=2):
        # Download Chromium from https://sites.google.com/a/chromium.org/chromedriver/home
        self.driver = Driver.Chrome(PATH + "/env/bin/chromedriver")
        # Wait for the page to be loaded befor looking for elements.
        self.driver.implicitly_wait(30)
        self.throttle = throttle

    def __get_json(self, url):
        Sleep(self.throttle)
        self.driver.get(url)
        text = self.driver.find_element_by_tag_name("pre").get_attribute("innerHTML")
        return Parse(text)

    def quit(self):
        self.driver.quit()

    def halt(self, message=""):
        print(message)
        self.quit()
        exit()

    def login(self):
        """ login the configured user to Instagram """
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
        """ Goes to the specified user page """
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
        text = False
        if len(media["edge_media_to_caption"]["edges"]):
            text = media["edge_media_to_caption"]["edges"][0]["node"]["text"]
        return {
            "id": media["id"],
            "text": text,
            "comments": media["edge_media_to_comment"]["count"],
            "likesReal": media["edge_liked_by"]["count"],
            "likesShow": media["edge_media_preview_like"]["count"],
            "isVideo": media["is_video"],
            "pic": media["thumbnail_src"],
            # TODO: find out why this is not working for all medias
            # "caption": media["accessibility_caption"],
        }

    def get_user(self, username=CONF["user"]["name"]):
        json = self.__get_json("{}/{}/?__a=1".format(URL_BASE, username))
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

    def get_user_query(self, id=False, query=False, key=False, page=False, accumulator=[]):
        vars = {
            "id": id,
            "include_reel": False,
            "fetch_mutual": False,
            "first": 9999,
        }
        if page:
            vars["after"] = page
        json = self.__get_json(URL_QUERY.format(query, Quote(Stringify(vars))))
        json = json["data"]["user"]["edge_" + key]
        accumulator = accumulator + list(
            map(lambda edge: self.get_user(edge["node"]["username"]), json["edges"])
        )
        if json["page_info"]["has_next_page"]:
            return self.get_user_query(
                id=id,
                query=query,
                key=key,
                page=json["page_info"]["end_cursor"],
                accumulator=accumulator
            )
        return accumulator

    def get_user_following(self, id):
        return self.get_user_query(
            id=id,
            query="c56ee0ae1f89cdbd1c89e2bc6b8f3d18",
            key="follow"
        )

    def get_user_followers(self, id):
        return self.get_user_query(
            id=id,
            query="56066f031e6239f35a904ac20c9f37d9",
            key="followed_by"
        )


bot = Bot()
bot.login()
user = bot.get_user()
user["followers"] = bot.get_user_followers(id=user["id"])
user["following"] = bot.get_user_following(id=user["id"])
print(Stringify(user))
bot.quit()