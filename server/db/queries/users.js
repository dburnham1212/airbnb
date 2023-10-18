const db = require('../../configs/db.config');

const getUserByEmail = async (user) => {
  try {
    const data = await db.query('SELECT * FROM users WHERE email=$1', [user.email]);
    return data.rows[0];
  } catch (error) {
    throw error;
  }
}

module.exports = { getUserByEmail };