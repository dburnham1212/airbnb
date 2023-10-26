# Airbnb Project

Airbnb is a clone of the popular site of the same name. It was developed using the PERN stack (PostgreSQL, Express, React, Node). It also uses GraphQL non RESTful queries as well as JSON Web Tokens for authentication and authorization of these queries.

## Final 

### Airbnb - Listings Page

Displays all listings available to a user and allows the user to search for specific listings based off of their address

!["Screenshot of listings page (displaying lisings)!"](https://github.com/dburnham1212/airbnb/blob/main/screenshots/ListingsPage.png)

### TinyApp - View Listing Page 

Displays listing information and allows a user to book a listing.

!["Screenshot of listing page (displaying a listing)!"](https://github.com/dburnham1212/airbnb/blob/main/screenshots/ViewListingPage.png)

### TinyApp - Login Page

Simple login page to allow users to use their credentials and login to the app to interact with the site.

!["Screenshot of login page!"](https://github.com/dburnham1212/tinyapp/blob/master/docs/TinuApp_Login_Page.png)

### TinyApp - Registration Page

Users can create new credentials which will be saved on the server. They can then login and create new URLs!

!["Screenshot of registration page!"](https://github.com/dburnham1212/tinyapp/blob/master/docs/TinuApp_Register_Page.png)



## Dependencies

- Node.js
- Express
- EJS
- bcryptjs
- cookie-session

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