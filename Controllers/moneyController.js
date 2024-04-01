const dbConnection = require('../database/mySQLconnect');
const setAccessToken = require('../config/setAccessToken');

require('dotenv').config();


const updateMoney = async (ctx) => {
    const { userName, money, avatar } = ctx.params;
    
    try {
        const query = `UPDATE users
                    SET money = ?,
                    SET avatar = ?
                     WHERE userName = ?`;

        await dbConnection.query({
            sql: query,
            values: [money, userName, avatar]
        });

        console.log("userMoney updated successfully");
        ctx.status = 201; // Created status code
        ctx.body = {
            status: "OK",
            user: {
                userName: userName,
                money: money,
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
    updateMoney,
};
