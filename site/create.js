"use strict";
var sqlite = require("sqlite");
create();

async function create() {
    try {
        var db = await sqlite.open("./users.db");
        await db.run("create table users (id, firstname, lastname, email, password)");
        await db.run("insert into users values (42,'John', 'Smith', 'john_smith@gmail.com', 'verysecret123')");
        await db.run("insert into users values (53,'Alice', 'Jones', 'alice_jones@yahoo.com', 'ilovepuppies789')");
        var as = await db.all("select * from users");
        console.log(as);
    } catch (e) { console.log(e); }
}