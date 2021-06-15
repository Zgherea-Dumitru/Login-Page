const db = require('../config/db-config');

const createUser = async (firstname, lastname, password, email) => {
    try {
        return await db.query('INSERT INTO users (firstname, lastname, password, email) VALUES (?, ?, ?, ?)', [firstname, lastname, password, email]);
    } catch (err) {
        throw new Error(err);
    }
};

const findEmail = async (email) => {
    try {
        const result = await db.query("SELECT email FROM users WHERE email = ?", [email]);
        return result[0];
    } catch (err) {
        console.log(err);
        throw new Error(err);
    }
};

module.exports = {
    createUser,
    findEmail
};