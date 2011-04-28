=======
Twilist
=======

List Management for Twitter
---------------------------

A self-contained server providing basic multi-user list-management for Twitter.

Dependencies
------------

- `web.py <http://https://github.com/webpy/webpy>`_
- `tweepy <https://github.com/joshthecoder/tweepy>`_

Installation
------------
1. Clone Twilist
2. You can either Clone Dependencies in a parent folder and let the soft-links do their job, or delete the links and Clone Dependencies right inside the folder.
3. rename ./pub to ./static since that's what web.py will use by default for static files.
4. Add your Twitter consumer key and secret in config.py
5. Hopefully everything will work now.

Structure
---------
- **twilist.py** Serves *html/index.html* and listens to POST requests with uri: */action/controller_name*
- **model.py** Database and OAuth Manager
- **pub** static files. *javascript* and *css*
- **html** Templates.
- **web** Dependency, Simple standalone web server.
- **tweepy** Dependency, Twitter API management layer.

Changelog
---------
- **2011|APR|28** Users can be added via oauth and lists are shown and stored in database.

ToDo
----
- List members adding.
- List members deletion.
