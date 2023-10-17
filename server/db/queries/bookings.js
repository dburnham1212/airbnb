const db = require('../../configs/db.config');

const getBookingById = async (id) => {
  try {
    const data = await db.query('SELECT * FROM bookings WHERE id = $1', [id]);
    return data.rows[0];
  } catch (error) {
    throw error;
  }
};

const getBookingsByListingId = async (id) => {
  try {
    const data = await db.query('SELECT * FROM bookings WHERE listing_id = $1', [id]);
    return data.rows;
  } catch (error) {
    throw error;
  }
}

module.exports = { getBookingById, getBookingsByListingId };