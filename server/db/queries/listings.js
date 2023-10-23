const db = require('../../configs/db.config');

const getAllListings = async () => {
  try {
    const data = await db.query('SELECT * FROM listings ORDER BY id DESC');
    return data.rows;
  } catch (error) {
    throw error;
  }
};

const getListingsByUserId = async (id) => {
  try {
    const data = await db.query('SELECT * FROM listings WHERE user_id = $1 ORDER BY id DESC', [id]);
    return data.rows;
  } catch (error) {
    throw error;
  }
}

const getListingById = async (id) => {
  try {
    const data = await db.query('SELECT * FROM listings WHERE id = $1 ORDER BY id DESC', [id]);
    return data.rows[0];
  } catch (error) {
    throw error;
  }
};

const getListingsByAddress = async (address) => {
  try {
    const data = await db.query('SELECT * FROM listings WHERE address ILIKE $1', [address]);
    return data.rows;
  } catch (error) {
    throw error;  }
};


const createListing = async (listing) => {
  try {
    const data = await db.query('INSERT INTO listings (user_id, image_url, name, description, address, price) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *', [listing.user_id, listing.image_url, listing.name, listing.description, listing.address, listing.price]);
    return data.rows[0];
  } catch (error) {
    throw error;
  }
}

const updateListing = async (listing) => {
  try {
    const data = await db.query('UPDATE listings SET image_url = $2, name = $3, description = $4, address = $5, price = $6 WHERE id = $1 RETURNING *', [listing.id, listing.image_url, listing.name, listing.description, listing.address, listing.price]);
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

module.exports = { getAllListings, getListingsByUserId, getListingById, getListingsByAddress, createListing, updateListing, deleteListingById };