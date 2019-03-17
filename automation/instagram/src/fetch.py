from math import inf as INFINITY

from instabot import Bot
from tinydb import TinyDB, where as Where

from common import CONF, PATH_DATA

PATH = PATH_DATA + "/instabot-"

db = TinyDB(PATH_DATA + "/db.json")
db_users = db.table("users")

bot = Bot(
    max_likes_per_day=INFINITY,
    max_unlikes_per_day=INFINITY,
    max_followers_to_follow=INFINITY,
    max_following_to_follow=INFINITY,
    max_following_to_block=INFINITY,
    filter_verified_accounts=True,
    filter_business_accounts=True,
    filter_private_users=True,
    filter_users_without_profile_photo=True,
    whitelist_file=PATH + "whitelist.txt",
    blacklist_file=PATH + "blacklist.txt",
    comments_file=PATH + "comments.txt",
    followed_file=PATH + "followed.txt",
    friends_file=PATH + "friends.txt",
    skipped_file=PATH + "skipped.txt",
    unfollowed_file=PATH + "unfollowed.txt"
)

bot.login(username=CONF['user']['name'], password=CONF['user']['pass'],)

medias = bot.get_your_medias()
if not medias:
    exit()

all = db_users.all()
print(len(all))
exit()
# Get users who liked medias (will ignore bot filters)
for media in medias:
    users = bot.get_media_likers(media)
    for user in users:
        if db_users.search(Where('id') == user):
            continue
        name = bot.get_username_from_user_id(user)
        db_users.insert({'id': user, 'name': name})
        print("inserted: " + name)
