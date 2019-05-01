"use strict";
var sqlite = require("sqlite");
fetch();

async function fetch() {
    try {
        var db = await sqlite.open("./users.db");
        var as = await db.all("select * from users");
        console.log(as);
    } catch (e) { console.log(e); }
}