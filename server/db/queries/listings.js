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

const createListing = async (listing) => {
  try {
    const data = await db.query('INSERT INTO bookings (listing_id, user_id, start_date, end_date) VALUES ($1, $2, $3, $4) RETURNING *', [listing.name, listing.description, listing.address, listing.price]);
    return data.rows[0];
  } catch (error) {
    throw error;
  }
}

const deleteListingById = async (id) => {
  try {
    const data = await db.query('DELETE FROM listings WHERE id = $1 RETURNING *', [id]);
    return data.rows[0];
  } catch (error) {
    throw error;
  }
};

module.exports = { getAllListings, getListingsByUserId, getListingById, deleteListingById };