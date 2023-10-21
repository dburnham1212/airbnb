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
    const data = await db.query('SELECT * FROM bookings WHERE user_id = $1 ORDER BY id', [id]);
    return data.rows;
  } catch (error) {
    throw error;
  }
}

const createBooking = async (booking) => {
  try {
    const data = await db.query('INSERT INTO bookings (listing_id, user_id, start_date, end_date) VALUES ($1, $2, $3, $4) RETURNING *', [booking.listing_id, booking.user_id, booking.start_date, booking.end_date]);
    return data.rows[0];
  } catch (error) {
    throw error;
  }
}

const updateBooking = async (booking) => {
  try {
    const data = await db.query('UPDATE bookings SET start_date = $2, end_date = $3 WHERE id = $1 RETURNING *', [booking.id, booking.start_date, booking.end_date]);
    return data.rows[0];
  } catch (error) {
    throw error;
  }
}

const deleteBookingById = async (id) => {
  try {
    const data = await db.query('DELETE FROM bookings WHERE id = $1 RETURNING *', [id]);
    return data.rows[0];
  } catch (error) {
    throw error;
  }
}

module.exports = { getAllBookings, getBookingById, getBookingsByListingId, getBookingsByUserId, createBooking, updateBooking, deleteBookingById };