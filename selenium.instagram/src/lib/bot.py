# python libs
from time import sleep as Sleep
from functools import reduce as Reduce
from inspect import currentframe as CurrentFrame, getargvalues as ArgValues
from json import loads as Parse, dumps as Stringify
from urllib.parse import quote_plus as Quote

# pipenv libs
from selenium import webdriver as Driver
from selenium.common.exceptions import NoSuchElementException

# local libs
from lib.common import CONF, PATH

LIMIT = 9999
URL_BASE = "https://www.instagram.com"
URL_QUERY = URL_BASE + "/graphql/query/?query_hash={}&variables={}"

ERROR = "ERROR: {}"
ERROR_NOT_IMPLEMENTED = ERROR.format("Not implemented yet")
ERROR_EXPECTING = ERROR.format("Expecting {}")

class Bot():

    def __init__(self, throttle=2):
        # Download Chromium from https://sites.google.com/a/chromium.org/chromedriver/home
        self.driver = Driver.Chrome("/usr/local/bin/chromedriver")
        # Wait for the page to be loaded befor looking for elements.
        self.driver.implicitly_wait(throttle)
        self.throttle = throttle

    def _get_json(self, url):
        Sleep(self.throttle)
        self.driver.get(url)
        try:
            text = self.driver.find_element_by_tag_name("pre").get_attribute("innerHTML")
            return Parse(text)
        except Exception as error:
            print(error)
            self.halt()

    def _get_json_query(self, id=False, vars={}, query=False, route=False, page=False, accumulator=[]):
        # is this an iterative call? append the variable to enable pagination.
        if page:
            vars["after"] = page
        # Get the raw json data from the corresponding URL
        json = self._get_json(URL_QUERY.format(query, Quote(Stringify(vars))))
        # according to the specified route, get the correct node.
        json = Reduce(lambda acc, cur: acc[cur], route, json)
        # if there are no edges available, then it's a simple json, no need to further parsing.
        if "edges" not in json:
            return json
        # given the current accumulated value, grab raw items from edges,
        accumulator = accumulator + list(
            map(lambda edge: edge["node"], json["edges"])
        )
        # are there more pages available? be recursive and get them.
        if json["page_info"]["has_next_page"]:
            # recursively send the same parameters available,
            # except the last two, which will be updated.
            arg_keys, _, _, arg_vals = ArgValues(CurrentFrame())
            arg = list(map(lambda key: arg_vals[key], arg_keys[1:-2]))
            return self._get_json_query(*(arg + [json["page_info"]["end_cursor"], accumulator]))
        # no more pages return the accumulated value.
        return accumulator

    def halt(self, message=""):
        print(message)
        self.driver.quit()
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

    def do_unfollow(self, username):
        Sleep(self.throttle)
        self.driver.get("{}/{}".format(URL_BASE, username))
        try:
            eButton = self.driver.find_element_by_xpath('//button[text()="Following"]')
            eButton.click()
        except NoSuchElementException:
            return False
        eButton = self.driver.find_element_by_css_selector("div[role=dialog] button:nth-child(1)")
        eButton.click()

    def goto_user(self, username=CONF["user"]["name"]):
        """ Goes to the specified user page """
        self.driver.get("{}/{}/?__a=1".format(URL_BASE, username))

    def get_user(self, username=CONF["user"]["name"]):
        json = self._get_json("{}/{}/?__a=1".format(URL_BASE, username))
        user = json["graphql"]["user"]
        return {
            "id": user["id"],
            "bio": user["biography"],
            "url": user["external_url"],
            "pic": user["profile_pic_url_hd"],
            "nameFull": user["full_name"],
            "nameUser": user["username"],
            "countFollowers": user["edge_followed_by"]["count"],
            "countFollowing": user["edge_follow"]["count"],
            "countMedias": user["edge_owner_to_timeline_media"]["count"],
            "business": False if not user["is_business_account"] else user["business_category_name"],
            "private": user["is_private"],
            "verified": user["is_verified"],
        }

    def get_media(self, shortcode=False):
        media = self._get_json_query(
            query="477b65a610463740ccdb83135b2014db",
            route=["data", "shortcode_media"],
            vars={
                "shortcode": shortcode,
                "child_comment_count": LIMIT,
                "fetch_comment_count": LIMIT,
                "parent_comment_count": LIMIT,
                "has_threaded_comments": False,
            },
        )
        # get a desription
        caption = False
        if "edges" in media["edge_media_to_caption"]:
            caption = media["edge_media_to_caption"]["edges"][0]["node"]["text"]
        likes = 0
        if "edge_liked_by" in media:
            likes = media["edge_liked_by"]["count"]
        elif "edge_media_preview_like" in media:
            likes = media["edge_media_preview_like"]["count"]
        return {
            "id": media["id"],
            "shortcode": media["shortcode"],
            "caption": caption,
            "url": media["display_url"],
            "location": media["location"] if "location" in media else False,
            "comments": media["edge_media_to_comment"]["count"],
            "likes": likes,
            "is_video": media["is_video"],
            "is_liked": media["viewer_has_liked"],
            "is_saved": media["viewer_has_saved"],
            "is_tag": media["viewer_in_photo_of_you"],
            "is_ad": media["is_ad"],
        }

    def get_user_following(self, id, full=True):
        users = self._get_json_query(
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
        # ask for the full info instead if the full flag is present
        return users if not full else list(
            map(lambda user: self.get_user(username=user["username"]), users)
        )

    def get_user_followers(self, id):
        users = self._get_json_query(
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
        medias = self._get_json_query(
            query="f2405b236d85e8296cf30347c9f08c2a",
            route=["data", "user", "edge_owner_to_timeline_media"],
            vars={
                "id": id,
                "include_reel": False,
                "fetch_mutual": False,
                "first": 9999,
            },
        )

        def mediator(media):
            media = self.get_media(shortcode=media["shortcode"])
            media["user"] = id
            return media

        return list(map(mediator, medias))

    def get_media_likes(self, shortcode):
        likes = self._get_json_query(
            query="e0f59e4a1c8d78d0161873bc2ee7ec44",
            route=["data", "shortcode_media"],
            vars={
                "shortcode": shortcode,
                "include_reel": False,
                "first": LIMIT,
            }
        )
        print(Stringify(likes))
        self.halt()
