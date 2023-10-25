import React, { useEffect, useContext, useState } from "react";
import { useMutation, useQuery, gql } from "@apollo/client";
import { useNavigate, useParams } from "react-router-dom";
import { DateRange } from "react-date-range";
import moment from "moment";
import { authContext } from "../context/AuthContext";
import ResourceNotFound from "./ReourceNotFound";

// Get booking GraphQL query
const GET_BOOKING = gql`
query GetBooking($id: Int!, $token: String!){
  booking(id: $id, token: $token){
    id
    start_date
    end_date
    listing{
      image_url
      name
      description
      address
      price
      bookings {
        start_date
        end_date
      }
    }
  }
}
`;

// Update booking GraphQL query
const UPDATE_BOOKING = gql`
mutation UpdateBooking($id: Int!, $start_date: Date!, $end_date: Date!, $token: String!){
  updateBooking(id: $id, start_date: $start_date, end_date: $end_date, token: $token) {
    id
  }
}
`;

const UpdateBooking = () => {
  const {
    handleJWTErrors
  } = useContext(authContext);
  // State Objects
  const [booking, setBooking] = useState({});
  const [currentListing, setCurrentListing] = useState({});
  const [blockedDates, setBlockedDates] = useState([]);
  const [bookingUpdated, setBookingUpdated] = useState(false);

  const [dateRange, setDateRange] = useState({
    startDate: new Date(),
    endDate: new Date(),
    key: "selection"
  });

  // Use Navigate to handle navigation
  const navigate = useNavigate();
  
  // Get bookingId from params in url
  const { bookingId } = useParams()
  
  // Set up update booking mutation to be used when updating a booking
  const [updateBooking] = useMutation(UPDATE_BOOKING);
  
  // On submit function to be called when a booking is updated
  const onSubmit = (event) => {
    event.preventDefault();

    // GraphQL query call to update a booking
    updateBooking({
      variables: {
        id: booking.id, start_date: dateRange.startDate, end_date: dateRange.endDate, token: localStorage.getItem("token")
      }
    }).then(() => {
      // If successful
      // Set the booking state object to reflect the new start dates
      setBooking({...booking, start_date: dateRange.startDate, end_date: dateRange.endDate});
      // Set state object to show that the booking has been updated
      setBookingUpdated(true);
    }).catch((err) => {
      handleJWTErrors(err);
      // If not successful log the error message to the console
      console.log(err.message);
    })
  };

  // Function to handle date selection
  const handleDateSelect = (ranges) =>{
    setDateRange(ranges.selection);
  };

  // Function to navigate to history when operations are completed
  const navigateToHistory = () => {
    navigate("/history");
  };

  // Function used to update the blocked dates that are not allowed to be booked
  const updateBlockedDates = (checkBookings, currentBooking) => {
    // Set up date arrays
    const blockedDatesArr = [];

    // Cycle through the bookings
    for(const booking of checkBookings) {
      let currentDate = moment(booking.start_date);
      let stopDate = moment(booking.end_date);
      // Check if the date we are checking is the same as the currently booked start date, if it is ignore it
      if(moment(new Date(currentDate)).format("MM-DD-YYYY") !== moment(currentBooking.start_date).format("MM-DD-YYYY")) {
        // Cycle through the dates to add dates to block to the list
        while(currentDate <= stopDate) {
          blockedDatesArr.push(new Date(currentDate));
          currentDate = moment(currentDate).add(1, 'days');
        };
      };
    };
    // Set blocked dates state object to the blocked dates array
    setBlockedDates(blockedDatesArr);
    // Set the current date range to match the booking
    setDateRange({...dateRange, startDate: new Date(currentBooking.start_date), endDate: new Date(currentBooking.end_date)});
  };

  // Query to get the listing data via GraphQL
  const { loading, error, data } = useQuery(GET_BOOKING, {
    variables: { id: Number(bookingId), token: localStorage.getItem("token") },
    fetchPolicy: 'cache-and-network'
  });

  // Check if the booking has been loaded
  useEffect(() => {
    if(!loading) {
      // If there is an error
      if(error) {
        // Handle JSON Web Token errors
        handleJWTErrors(error);
      } else {
        // Set booking to the object returned from the query
        setBooking({...booking, id: data.booking.id, startDate: data.booking.startDate, endDate: data.booking.endData});
        
        // Set the current listing to the object returned from the query
        setCurrentListing({...currentListing, name: data.booking.listing.name, description: data.booking.listing.description, address: data.booking.listing.address, price: data.booking.listing.price});
  
        // Update blocked dates based off of the bookings saved in the listing returned from the query 
        updateBlockedDates(data.booking.listing.bookings, data.booking);
      }
    }
  }, [loading]);


  // Wait for values to be returned from GraphQL
  if (loading) return <p>Loading...</p>;
  if (error) return <ResourceNotFound/>;

  return(
    <div className="d-flex justify-content-center py-5 mx-2">
      <div className="card col-12 col-sm-8 col-md-7 col-lg-6 col-xl-6 text-center position-fixed overflow-auto">
        <div className="card-header bg-dark">
          <h2 className="text-light">Change Booking</h2>
        </div>
        {bookingUpdated ? <div className="card-body">
          <div className="border rounded bg-light py-3 mb-3">
            <h4 className="pb-2">Booking Successfully Updated</h4>
            <h5 className="pb-2">{currentListing.name}</h5>
            <p>Start Date: {moment(booking.start_date).format("MM/DD/YYYY")}</p>
            <p>End Date: {moment(booking.end_date).format("MM/DD/YYYY")}</p>
          </div>
          <div className="d-flex justify-content-end">
            <button className="btn btn-dark" onClick={navigateToHistory}>Return to History</button>
          </div>
        </div>
        
        :
        <div className="card-body">
          <div className="border rounded bg-light py-3 mb-3">
            <h5 className="pb-2">{currentListing.name}</h5>
            <p>Start Date {moment(booking.start_date).format("MM/DD/YYYY")}</p>
            <p>End Date {moment(booking.end_date).format("MM/DD/YYYY")}</p>
          </div>
          <DateRange
            minDate={new Date()}
            disabledDates={blockedDates}
            ranges={[dateRange]}
            onChange={handleDateSelect}
          />
          <div className="d-flex justify-content-end mx-2 my-4 gap-2">
            <button className="btn btn-dark" onClick={(e) => onSubmit(e)}>Update Booking</button>
            <button className="btn btn-danger" onClick={navigateToHistory}>Cancel</button>
          </div>
        </div>
        }
      </div>
    </div> 
  )
}

export default UpdateBooking;