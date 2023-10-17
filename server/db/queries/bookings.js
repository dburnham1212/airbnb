const db = require('../../configs/db.config');

const getAllBookings = async () => {
  try {
    const data = await db.query('SELECT * FROM bookings');
    return data.rows;
  } catch (error) {
    throw error;
  }
}

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

const getBookingsByUserId = async (id) => {
  try {
    const data = await db.query('SELECT * FROM bookings WHERE user_id = $1', [id]);
    return data.rows;
  } catch (error) {
    throw error;
  }
}

module.exports = { getAllBookings, getBookingById, getBookingsByListingId, getBookingsByUserId };