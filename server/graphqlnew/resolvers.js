const listings = require('../db/queries/listings');

module.exports = {
  Query: {
    async listing (_, { Id }) {
      return await listings.getListingById(Id);
    },
    async getListings () {
      return await listings.getAllListings();
    }
  }
}