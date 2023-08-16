from bot import Bot

bot = Bot()
bot.login()
user = bot.get_user()
user["followers"] = bot.get_user_followers(id=user["id"])
medias = bot.get_user_medias(id=user["id"])

ot.halt()
