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
    const data = await db.query('INSERT INTO listings (user_id, name, description, address, price) VALUES ($1, $2, $3, $4, $5) RETURNING *', [listing.user_id, listing.name, listing.description, listing.address, listing.price]);
    return data.rows[0];
  } catch (error) {
    throw error;
  }
}

const updateListing = async (listing) => {
  try {
    const data = await db.query('UPDATE listings SET name = $2, description = $3, address = $4, price = $5 WHERE id = $1 RETURNING *', [listing.id, listing.name, listing.description, listing.address, listing.price]);
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

module.exports = { getAllListings, getListingsByUserId, getListingById, createListing, updateListing, deleteListingById };