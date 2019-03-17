# python libs
from time import sleep as Sleep
from functools import reduce as Reduce
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
ERROR_EXPECTING = ERROR.format("Expecting {}")

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

    def __get_json_query(self, id=False, vars={}, query=False, route=False, page=False, accumulator=[]):
        # is this an iterative call? append the variable to enable pagination.
        if page:
            vars["after"] = page
        # Get the raw json data from the corresponding URL
        json = self.__get_json(URL_QUERY.format(query, Quote(Stringify(vars))))
        # according to the specified route, get the correct node.
        json = Reduce(lambda data, key: data[key], route, json)
        # given the current accumulated value, grab raw items from edges,
        accumulator = accumulator + list(
            map(lambda edge: edge["node"], json["edges"])
        )
        # are there more pages available? be recursive and get them.
        if json["page_info"]["has_next_page"]:
            return self.__get_json_query(
                id=id,
                query=query,
                route=route,
                page=json["page_info"]["end_cursor"],
                accumulator=accumulator
            )
        # no more pages return the accumulated value.
        return accumulator

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

    def get_user(self, username=CONF["user"]["name"]):
        json = self.__get_json("{}/{}/?__a=1".format(URL_BASE, username))
        user = json["graphql"]["user"]
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
            "business": False if not user["is_business_account"] else user["business_category_name"],
            "private": user["is_private"],
            "verified": user["is_verified"],
        }

    def get_user_following(self, id):
        users = self.__get_json_query(
            query="c56ee0ae1f89cdbd1c89e2bc6b8f3d18",
            route=["data", "user", "edge_follow"],
            vars={
                "id": id,
                "include_reel": False,
                "fetch_mutual": False,
                "first": 9999,
            },
        )
        # the query returns only a subset of the information,
        # ask for the full info instead.
        return list(
            map(lambda user: self.get_user(username=user["username"]), users)
        )

    def get_user_followers(self, id):
        users = self.__get_json_query(
            query="56066f031e6239f35a904ac20c9f37d9",
            route=["data", "user", "edge_followed_by"],
            vars={
                "id": id,
                "include_reel": False,
                "fetch_mutual": False,
                "first": 9999,
            },
        )
        # the query returns only a subset of the information,
        # ask for the full info instead.
        return list(
            map(lambda user: self.get_user(username=user["username"]), users)
        )

    def get_user_medias(self, id):
        return self.__get_json_query(
            query="f2405b236d85e8296cf30347c9f08c2a",
            route=["data", "user", "edge_owner_to_timeline_media"],
            vars={
                "id": id,
                "include_reel": False,
                "fetch_mutual": False,
                "first": 9999,
            },
        )

    def get_media(self, shortcode=False):
        media = self.__get_json_query(
            query="477b65a610463740ccdb83135b2014db",
            route=["data", "shortcode_media"],
            vars={
                "shortcode": shortcode,
                "child_comment_count": 3,
                "fetch_comment_count": 40,
                "parent_comment_count": 24,
                "has_threaded_comments": False,
            },
        )
        print(media)
        # media = media["node"]
        # if not id and not media:
        #     self.halt(ERRROR_EXPECTING.format("either an id or a media"))
        # if id:
        #     # TODO: Find a way to retrieve a media by id
        #     self.halt(ERROR_NOT_IMPLEMENTED)
        # if not media:
        #     return {}
        # text = False
        # if len(media["edge_media_to_caption"]["edges"]):
        #     text = media["edge_media_to_caption"]["edges"][0]["node"]["text"]
        # return {
        #     "id": media["id"],
        #     "text": text,
        #     "comments": media["edge_media_to_comment"]["count"],
        #     "likesReal": media["edge_liked_by"]["count"],
        #     "likesShow": media["edge_media_preview_like"]["count"],
        #     "isVideo": media["is_video"],
        #     "pic": media["thumbnail_src"],
        #     # TODO: find out why this is not working for all medias
        #     # "caption": media["accessibility_caption"],
        # }



bot = Bot()
bot.login()
user = bot.get_user()
# user["followers"] = bot.get_user_followers(id=user["id"])
medias = bot.get_user_medias(id=user["id"])



# TODO: get_user_medias already retrieves a list of all medias for a user
#       but the information is not complete (or is it? check for failsafe)
#       use the get_media method as reference, but analize the query for
#       getting specific media, to see if we can get more information.
#       if not, then implement the likes for media, and comments for media.

# TODO: Renombrar __get_json_query a get_json_edges
# TODO: hacer una implementacion especifica para obtener el shorcode media
#       https://www.instagram.com/graphql/query/?query_hash=477b65a610463740ccdb83135b2014db&variables=%7B%22shortcode%22%3A%22Bu2gZhggNDx%22%2C%22child_comment_count%22%3A3%2C%22fetch_comment_count%22%3A40%2C%22parent_comment_count%22%3A24%2C%22has_threaded_comments%22%3Afalse%7D
# media = bot.get_media(shortcode="Bu2gZhggNDx")

bot.quit()