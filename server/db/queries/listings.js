const db = require('../../configs/db.config');

const getAllListings = async () => {
  try {
    const data = await db.query('SELECT * FROM listings');
    return data.rows;
  } catch (error) {
    throw error;
  }
};

const getListingsByUserId = async (id) => {
  try {
    const data = await db.query('SELECT * FROM listings WHERE user_id = $1', [id]);
    return data.rows;
  } catch (error) {
    throw error;
  }
}

const getListingById = async (id) => {
  try {
    const data = await db.query('SELECT * FROM listings WHERE id = $1', [id]);
    return data.rows[0];
  } catch (error) {
    throw error;
  }
};

const deleteListingById = async (id) => {
  try {
    const data = await db.query('SELECT * FROM listings WHERE id = $1', [id]);
    return data.rows[0];
  } catch (error) {
    throw error;
  }
};

module.exports = { getAllListings, getListingsByUserId, getListingById };