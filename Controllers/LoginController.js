const dbConnection = require('../database/mySQLconnect');
const setAccessToken = require('../config/setAccessToken');

require('dotenv').config();

const authorizeUser = async (ctx) => {
    return new Promise((resolve, reject) => {
        let query = "SELECT * FROM users WHERE userName = ?";
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
                if (tuples.length === 1) {
                    setAccessToken(ctx, tuples[0]);
                    console.log('User authorized:', tuples[0]);
                    ctx.body = {
                        status: "OK",
                        user: tuples[0],
                    };
                } else {
                    console.log('User not found.');
                    return reject('No such user.');
                }
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

const allUsers = async (ctx) => {
    return new Promise((resolve, reject) => {
        let query = "SELECT * FROM users ";
        dbConnection.query(
            {
                sql: query,
                
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

const createUser = async (ctx) => {
    const { userName, userPassword, avatar } = ctx.params;

    try {
        const query = `INSERT INTO users (userName, userPassword, avatar)
                       VALUES (?, ?, ?)`;

        await dbConnection.query({
            sql: query,
            values: [userName, userPassword, avatar]
        });

        console.log("User created successfully");
        ctx.status = 201; // Created status code
        ctx.body = {
            status: "OK",
            user: {
                userName: userName,
                userPassword: userPassword, // Note: Avoid sending the password back in response
                avatar: avatar
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


module.exports = {
    authorizeUser,
    createUser,
    allUsers
};
