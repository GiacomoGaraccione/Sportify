'use strict';

const sqlite = require('sqlite3').verbose();

const DBSOURCE = './sportify.db';

const db = new sqlite.Database(DBSOURCE, (err) => {
    if (err) {
        // Cannot open database
        throw err;
    }
});
module.exports = db;