"use strict";
var sqlite = require("sqlite");
fetch();

async function fetch() {
    try {
        var db = await sqlite.open("./users.db");
        var as = await db.get("select * from users where id=42");
        console.log(as);
    } catch (e) { console.log(e); }
}