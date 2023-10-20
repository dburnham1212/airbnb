const db = require('../../configs/db.config');

const getUserByEmail = async (user) => {
  try {
    const data = await db.query('SELECT * FROM users WHERE email = $1', [user.email]);
    return data.rows[0];
  } catch (error) {
    throw error;
  }
}

const getUserById = async (id) => {
  try {
    const data = await db.query('SELECT * FROM users WHERE id = $1', [id]);
    return data.rows[0];
  } catch (error) {
    throw error;
  }
}

const createUser = async (user) => {
  try {
    const data = await db.query('INSERT INTO users(first_name, last_name, phone_number, email, password, role) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *', [user.first_name, user.last_name, user.phone_number, user.email, user.password, user.role]);
    return data.rows[0];
  } catch (error) {
    throw error;
  }
}



module.exports = { getUserByEmail, getUserById, createUser };