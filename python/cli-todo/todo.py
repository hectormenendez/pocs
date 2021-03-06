#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""

@author Hector Menendez <h@cun.mx>
@updated 2011/SEP/17 06:30
@created 2011/SEP/06 04:12

"""
import baker
import sqlite3
import os
import datetime
import shutil
import sys

PATH = os.getcwd() + '/.todo/'

if not os.path.exists(PATH):
    os.makedirs(PATH)

# By using the isolation_level arg we tell the DB
# not to use transactions and commit right away.
database = sqlite3.connect(PATH + 'DB', isolation_level=None)
db = database.cursor()

db.execute("""
    CREATE TABLE IF NOT EXISTS 'todo'(
       'id'  INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
     'date' DATETIME NOT NULL    DEFAULT CURRENT_TIMESTAMP,
     'text'     TEXT NOT NULL
    )
""")

# Keep IDs in perfect continuous series
db.execute("""
    CREATE TRIGGER IF NOT EXISTS 'reindex_delete'
    AFTER DELETE ON 'todo' FOR EACH ROW BEGIN
        UPDATE 'todo' SET id = -id WHERE id > old.id;  /* temp id */
        UPDATE 'todo' SET id = abs(id)-1 WHERE id < 0;
    END;
""")


@baker.command
def add(text):
    """
    Adds an item.
    """
    date = datetime.datetime.now().strftime("%Y/%b/%d %H:%M").upper()
    sql = "INSERT INTO 'todo' ('date','text') VALUES (?,?)"
    cur = db.execute(sql, (date, text.decode('utf-8'),))
    print "\nAdded item #%d" % cur.lastrowid
    ls()


@baker.command
def rm(id):
    """
    Removes an item by ID.
    """
    cur = db.execute("DELETE FROM 'todo' WHERE id=?", (id,))
    print " "
    if cur.rowcount is 0:
        print "ID did not exist."
        sys.exit(1)
    print "Deleted #%s" % id
    db.execute(
    """ UPDATE sqlite_sequence
           SET seq  = (SELECT id FROM todo ORDER BY id LIMIT 1)
         WHERE name = 'todo'
    """)
    ls()


@baker.command
def ls():
    """
    Shows all items.
    """
    qry = db.execute("SELECT * FROM 'todo' ORDER BY 'date'").fetchall()
    print " "
    for row in qry:
        print " " + str(row[0]) + ":\t" + row[1] + "   " + row[2]
    print " "


@baker.command
def reset():
    """
    Removes .todo directory from current path.
    """
    database.close()
    shutil.rmtree(PATH, True)
    print "TODO files were removed."

baker.run()
