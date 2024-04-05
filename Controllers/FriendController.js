const dbConnection = require('../database/mySQLconnect');
const setAccessToken = require('../config/setAccessToken');

require('dotenv').config();

const showFriends = async (ctx) => {
    return new Promise((resolve, reject) => {
        let query = `select * from friends 
                    where (userName1 = ? OR userName2 = ?)
                    AND rStatus = ?`;
        dbConnection.query(
            {
                sql: query,
                values: [ctx.params.userName1, ctx.params.userName2, ctx.params.rStatus]
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
        console.error('ShowFriends threw an exception:', err);
        ctx.status = 200; // Consider using appropriate HTTP status code
        ctx.body = {
            status: "Failed",
            error: err,
            user: null
        };
    });
};

const searchFriends = async (ctx) => {
    return new Promise((resolve, reject) => {
        let query = `SELECT * 
                    FROM users
                    WHERE userName LIKE ?`;
        let searchTerm = `%${ctx.params.userName}%`; // Concatenate wildcard characters with search term
        dbConnection.query(
            {
                sql: query,
                values: [searchTerm]
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


const addFriend = async (ctx) => {
    //const { userName, userPassword, avatar } = ctx.params;

    try {
        const query = `INSERT INTO friends (userID1,userName1,userID2,userName2, rStatus , rTime)
                        VALUES (?, ?, ?, ?, ?, current_timestamp())`;

        await dbConnection.query({
            sql: query,
            values: [ctx.params.userID1, ctx.params.userName1, 
                    ctx.params.userID2, ctx.params.userName2, ctx.params.rStatus]
        });

        console.log("User created successfully");
        ctx.status = 201; // Created status code
        ctx.body = {
            status: "OK",
            user: {
                userID1: ctx.params.userID1,
                userName1: ctx.params.userName1, // Note: Avoid sending the password back in response
                userID2: ctx.params.userID2,
                userName2: ctx.params.userName2,
                rStatus: ctx.params.rStatus,
            }
        };
    } catch (error) {
        console.error("Query error:", error);
        ctx.status = 500; // Internal Server Error status code
        ctx.body = {
            status: "Failed",
            error: error.message, // Send error message instead of raw error
            user: null
        };
    }
};

const acceptRequest = async (ctx) => {
    const {userName} = ctx.params;

    try {
        const query = `UPDATE friends
                    SET rTime = CURRENT_TIMESTAMP, rStatus = 'accepted'
                    WHERE userID1= ? and userID2 = ? `;

        await dbConnection.query({
            sql: query,
            values: [ctx.params.userID1, ctx.params.userID2]
        });

        console.log("found stats of user successfully");
        ctx.status = 201; // Created status code
        ctx.body = {
            status: "OK",
            user: {
                userID1: ctx.params.userID1,
                userName1: ctx.params.userID2,
            }
        };
    } catch (error) {
        console.error("Query error:", error);
        ctx.status = 500; // Internal Server Error status code
        ctx.body = {
            status: "Failed",
            error: error.message, // Send error message instead of raw error
            user: null
        };
    }
};

const rejectRequest = async (ctx) => {
    return new Promise((resolve, reject) => {
        let query = `DELETE FROM friends
                    WHERE (userID1 = ? AND userID2 = ?)`;
        dbConnection.query(
            {
                sql: query,
                values: [ctx.params.userID1, ctx.params.userID2]
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
    showFriends,
    searchFriends,
    addFriend,
    acceptRequest,
    rejectRequest,
};
