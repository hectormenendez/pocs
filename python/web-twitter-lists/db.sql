CREATE TABLE "lista" ("id" INTEGER PRIMARY KEY UNIQUE, "id_user" INTEGER , "name" TEXT);
CREATE TABLE "member" ("id" INTEGER PRIMARY KEY UNIQUE, "id_list" INTEGER , "name" TEXT);
CREATE TABLE "session" ("id" INTEGER PRIMARY KEY  NOT NULL  DEFAULT (0) ,"key" TEXT,"pwd" TEXT);
CREATE TABLE "user" ("id" INTEGER PRIMARY KEY UNIQUE, "name" TEXT , "key" TEXT , "pwd" TEXT);
