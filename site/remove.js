"use strict";
var sqlite = require("sqlite");
remove();

async function remove() {
    var db = await sqlite.open("./users.db");
    await db.run("delete from users where id=64");
}