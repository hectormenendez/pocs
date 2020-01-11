from lib.bot import Bot

bot = Bot(throttle=15)
bot.login()

self = bot.get_user()

followed = bot.get_user_following(id=self["id"], full=False)

count = 0
for user in followed:
    bot.do_unfollow(user["username"])
    count = count + 1

bot.halt()