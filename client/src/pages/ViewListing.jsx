import React, {useState, useContext, useEffect} from "react";
import { authContext } from "../context/AuthContext";
import { useQuery, useMutation, gql } from "@apollo/client";
import { useParams } from "react-router-dom";
import { DateRange } from "react-date-range";
import moment from "moment"

// Get listing GraphQL query
const GET_LISTING = gql`
  query GetListing($id: Int!){
    listing(id: $id){
      id
      image_url
      name
      description
      address
      price
      bookings {
        start_date
        end_date
        user {
          first_name
          last_name
        }
      }
    }
  }
`;

// GraphQL query to add a booking
const ADD_BOOKING = gql`
  mutation AddBooking($listing_id: Int!, $user_id: Int!, $start_date: Date!, $end_date: Date!){
    addBooking(listing_id: $listing_id, user_id: $user_id, start_date: $start_date, end_date: $end_date){
      id
      start_date
      end_date
      user{
        first_name
        last_name
      }
    }
  }
`;

const ViewListing = () => {
  // Import user variable from context
  const {
    user
  } = useContext(authContext);

  // State Objects
  const [bookings, setBookings] = useState([]);
  const [listing, setListing] = useState({});
  const [blockedDates, setBlockedDates] = useState([]);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(),
    endDate: new Date(),
    key: "selection"
  });

  // Import listing id from params in the url
  const { listingId } = useParams();

  // Set up create booking mutation to be used when a booking is created
  const [addBooking, newBooking] = useMutation(ADD_BOOKING);

  // Function used to create a new booking
  const createBooking = (event) => {
    event.preventDefault()

    // Promise to add booking to the database
    addBooking({
      variables: {
        listing_id: Number(listingId), user_id: user.id, start_date: dateRange.startDate, end_date: dateRange.endDate
      }
    }).then((res) => {
      // If successful
      // Add the new booking to the list and sort it from latest start date to earliest
      const newBookings = sortBookings([...bookings, res.data.addBooking]);
      // Set the booking state to the new object
      setBookings(newBookings);
      // Update the blocked dates list so that the user can no longer select dates within previously booked range
      updateBlockedDates(newBookings);
    }).catch((err)  => {
      // If not successful
      console.log(err.message);
    })
  };

  // Query to get the listing data via GraphQL
  const { loading, error, data } = useQuery(GET_LISTING, {
    variables: { id: Number(listingId) },
    fetchPolicy: 'cache-and-network'
  });

  // Function to run after we have gotten the listing from GraphQL
  useEffect(() => {
    if (!loading) {
      // Create a variable for listing and set it to the data recieved
      const currentListing = data.listing;

      // Set the listing state to the current listing from GraphQL
      setListing(currentListing);

      // Sorting the bookings from latest start date to earliest
      currentListing.bookings = sortBookings(currentListing.bookings);
      // Setting the bookings state to the bookings for the listing from GraphQL
      setBookings(currentListing.bookings)

      // Updating blocked dates list so that a user cannot book over another booking
      updateBlockedDates(currentListing.bookings);
      
    } 
  }, [loading]);

  // Function to sort bookings from latest start date to earliest
  const sortBookings = (bookings) => {
    return bookings.sort((a, b) => {
      if(a.start_date < b.start_date) {
        return 1;
      }
      if(a.start_date > b.start_date) {
        return -1;
      }
      return 0;
    });
  };

  // Function to update the blocked dates array
  const updateBlockedDates = (checkBookings) => {
    // Set up blocked dates arrays
    const blockedDatesArr = [];
    const blockedDatesStrArr = [];

    // Cycle through the bookings
    for(const booking of checkBookings) {
      let currentDate = moment(booking.start_date);
      let stopDate = moment(booking.end_date);
      // While the current date is less than the end date
      while(currentDate <= stopDate) {
        // Add the date to the date array and move on to the next day
        blockedDatesArr.push(new Date(currentDate));
        blockedDatesStrArr.push(moment(new Date(currentDate)).format("MM-DD-YYYY"));
        currentDate = moment(currentDate).add(1, 'days');
      };
    };
    // Set the blocked dates state to the array
    setBlockedDates(blockedDatesArr);
    
    // Set up the current date in date picker
    let currentStartDate = moment(dateRange.startDate);
    // While the current date exists in the list of dates cycle to the next day
    while(blockedDatesStrArr.includes(moment(currentStartDate).format("MM-DD-YYYY"))) {
      currentStartDate = moment(currentStartDate).add(1, 'days');
    };
    // Set the date range object based off found start date
    setDateRange({...dateRange, startDate: new Date(currentStartDate), endDate: new Date(currentStartDate)});
  };
  
  // Function to handle date selection
  const handleDateSelect = (ranges) =>{
    setDateRange(ranges.selection)
  }

  // Wait for values to be returned from GraphQL
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error : {error.message}</p>;

  // Set up the booking history table 
  const bookingHistory = bookings.map((booking, i) => {
    return (
      <tr key={i}>
        <td>{booking.user.first_name} {booking.user.last_name}</td>
        <td>{moment(booking.start_date).format("MM/DD/YYYY")}</td>
        <td>{moment(booking.end_date).format("MM/DD/YYYY")}</td>
      </tr>
    )
  })


  return(
    
    <div className="text-center py-4">
      
      <div className="container-fluid">
        <div className="row justify-content-center g-2">
          <img className="object-fit-cover col-11 col-sm-11 col-md-11 col-lg-9 col-xl-9 border rounded" src={listing.image_url} alt="listing image" height="600"/>
          <div className="col-11 col-sm-11 col-md-11 col-lg-4 col-xl-4 ">
            <div className="card h-100">
              <div className="card-header bg-dark">
                <h6 className="text-light">Listing Details</h6>
              </div>
              <div className="card-body d-flex flex-column justify-content-between">
                <div>
                  <h5 className="border-bottom border-dark mx-3 py-2 text-uppercase">{listing.name}</h5>
                  <p>{listing.description}</p>
                  <p>Address: {listing.address}</p>
                </div>
                <div>
                  <div className="border-top w-100 py-2 fw-bold"> ${listing.price} CAD per night</div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-11 col-sm-11 col-md-11 col-lg-5 col-xl-5">
            <div className="card">
              <div className="card-header bg-dark">
                <h6 className="text-light">Book Listing</h6>
              </div>
              <div className="card-body">
                <DateRange
                  minDate={new Date()}
                  disabledDates={blockedDates}
                  ranges={[dateRange]}
                  onChange={handleDateSelect}
                />
                <div className="form-group py-3">
                  <button className="btn btn-dark" onClick={(e) => createBooking(e)}> Book Listing </button>
                </div>
              </div>
            </div>
          </div>
          <div className="card card col-11 col-sm-11 col-md-11 col-lg-9 col-xl-9 ">
            <div className="card-header bg-dark">
              <h6 className="text-light">Booking History</h6>
            </div>
            <div className="card-body">
              <table className="table">
                <thead>
                  <tr>
                    <th>Guest</th>
                    <th>Start Date</th>
                    <th>End Date</th>
                  </tr>
                </thead>
                <tbody>
                  {bookingHistory.length > 0 &&  
                    <>
                      {bookingHistory}
                    </>
                  }
                </tbody>
              </table>
              {bookingHistory.length === 0 &&  
                <h6>
                  No Booking History Found
                </h6>
              }
            </div>
          </div>
        </div>
      </div>
      
    </div>
  )
}

export default ViewListing;