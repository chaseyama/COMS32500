"use strict";
var sqlite = require("sqlite");
insert();

async function insert() {
    var db = await sqlite.open("./users.db");
    await db.run("insert into users values (64,'Darth', 'Vader', 'darth_vader@empire.net', 'lukeiamyourfather')");
    // USING A PREPARED STATEMENT INSTEAD
	// var ps = db.prepare("insert into users values (?, ?, ?, ?, ?)");
	// await ps.run(64,'Darth', 'Vader', 'darth_vader@empire.net', 'lukeiamyourfather');
	// await ps.finalize();
}