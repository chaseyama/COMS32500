"use strict";
var sqlite = require("sqlite");
update();

async function update() {
    var db = await sqlite.open("./users.db");
    await db.run("update users set password='ihatecats456' where id=53");
    // USING A PREPARED STATEMENT INSTEAD
	// var ps = db.prepare("update users set password=? where id=?");
	// await ps.run("ihatecats456", 53);
	// await ps.finalize();
}