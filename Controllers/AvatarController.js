const dbConnection = require('../database/mySQLconnect');
const setAccessToken = require('../config/setAccessToken');

require('dotenv').config();

const showAvatars = async (ctx) => {
    return new Promise((resolve, reject) => {
        let query = `select avatar from avatars 
                    where userName = ?
                    `;
        dbConnection.query(
            {
                sql: query,
                values: [ctx.params.userName]
            },
            (error, tuples) => {
                if (error) {
                    console.error("Query error:", error);
                    return reject(`Query error: ${error}`);
                }
                ctx.body = tuples;
                return resolve();
            }
        );
    }).catch(err => {
        console.error('showAvatars threw an exception:', err);
        ctx.status = 200; // Consider using appropriate HTTP status code
        ctx.body = {
            status: "Failed",
            error: err,
            user: null
        };
    });
};

const insertAvatars = async (ctx) => {
    return new Promise((resolve, reject) => {
        let query = `INSERT INTO avatars (userID, userName, avatar)
                    VALUES (?, ?, ?);
        `;
        dbConnection.query(
            {
                sql: query,
                values: [ctx.params.userID, ctx.params.userName, ctx.params.avatar]
            },
            (error, tuples) => {
                if (error) {
                    console.error("Query error:", error);
                    return reject(`Query error: ${error}`);
                }
                ctx.body = tuples;
                return resolve();
            }
        );
    }).catch(err => {
        console.error('authorizeUser threw an exception:', err);
        ctx.status = 200; // Consider using appropriate HTTP status code
        ctx.body = {
            status: "Failed",
            error: err,
            user: null
        };
    });
};




module.exports = {
    showAvatars,
    insertAvatars,
};
