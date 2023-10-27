# Airbnb Project

Airbnb is a clone of the popular site of the same name. It was developed using the PERN stack (PostgreSQL, Express, React, Node). It also uses GraphQL for non-RESTful queries as well as JSON Web Tokens for authentication and authorization.

## Final 

### Airbnb - Listings Page

Displays all listings available to a user and allows the user to search for specific listings based off of their address.

!["Screenshot of Listings Page (displaying lisings)!"](https://github.com/dburnham1212/airbnb/blob/main/screenshots/ListingsPage.png)

### Airbnb - View Listing Page 

Displays listing information and allows a user to book a listing.

!["Screenshot of Listing Page (displaying a listing)!"](https://github.com/dburnham1212/airbnb/blob/main/screenshots/ViewListingPage.png)

### Airbnb - My Listings Page

Displays all listings that an admin user has created. Displays similar information to the my listings page however allows an admin user to update and delete their listings.

!["Screenshot of My Listings Page!"](https://github.com/dburnham1212/airbnb/blob/main/screenshots/MyListingsPage.png)

### Airbnb - New Listing Page

Page that allows an admin user to create their own listings for the site.

!["Screenshot of New Listing Page!"](https://github.com/dburnham1212/airbnb/blob/main/screenshots/NewListingPage.png)

### Airbnb - Update Listing Page

Page that allows an admin user to make changes to a previously created listing.

!["Screenshot of New Update Listing Page!"](https://github.com/dburnham1212/airbnb/blob/main/screenshots/UpdateListingPage.png)


### Airbnb - My Bookings Page

Displays all of the bookings that the user has made. Allows the user to cancel or update their current bookings. Users are not able to book dates that have previously been booked.

!["Screenshot of My Bookings Page!"](https://github.com/dburnham1212/airbnb/blob/main/screenshots/MyBookingsPage.png)

### Airbnb - Change Booking Page

Allows a user to update their booking dates. A user will be allowed to book over the dates in the updated booking but will not be able to book dates that have previously been booked.

!["Screenshot of Change Booking Page!"](https://github.com/dburnham1212/airbnb/blob/main/screenshots/ChangeBookingPage.png)

## Getting Started

Client:
- Install all dependencies (using the `npm install` command).
- Run the development client using the `npm start` command.

Server:
- Install all dependencies (using the `npm install` command).
- Initialize a database to store airbnb data in PostgreSQL.
- Create and .env file using the env example provided.
- Reset the database using the `npm db:reset` command.
- Run the development web server using the `npm start` command.

## Dependencies

Client:

 - Node.js
 - @apollo/client,
 - @testing-library/jest-dom
 - @testing-library/react
 - @testing-library/user-event
 - bootstrap
 - date-fns
 - graphql
 - jwt-decode
 - moment
 - react
 - react-date-range
 - react-dom
 - react-router-dom
 - react-scripts
 - web-vitals

Server:
 - bcryptjs
 - cors
 - dotenv
 - express
 - express-graphql
 - graphql
 - jsonwebtoken
 - morgan
 - pg

Server:

