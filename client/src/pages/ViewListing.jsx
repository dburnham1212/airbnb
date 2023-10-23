import React, {useState, useContext, useEffect} from "react";
import { authContext } from "../context/AuthContext";
import { useQuery, useMutation, gql } from "@apollo/client";
import { useParams } from "react-router-dom";
import moment from "moment"
import {DateRange} from "react-date-range";


import { setDate } from "date-fns";

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

const CREATE_BOOKING = gql`
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
`



const ViewListing = () => {
  const {
    user
  } = useContext(authContext);

  const [bookings, setBookings] = useState([]);
  const [listing, setListing] = useState({});
  const [dateRange, setDateRange] = useState({
    startDate: new Date(),
    endDate: new Date(),
    key: "selection"
  });
  const [blockedDates, setBlockedDates] = useState([]);

  const { listingId } = useParams();

  const [addBooking, newBooking] = useMutation(CREATE_BOOKING);

  // Function used to create a new booking
  const createBooking = (event) => {
    event.preventDefault()
    addBooking({
      variables: {
        listing_id: Number(listingId), user_id: user.id, start_date: dateRange.startDate, end_date: dateRange.endDate
      }
    }).then((res) => {
      const newBookings = [...bookings, res.data.addBooking];
      setBookings(newBookings)
      updateBlockedDates(newBookings)
    }).catch((err)  => {
      console.log(err.message);
    })
  };

  // Query to get the listing data via GraphQL
  const { loading, error, data } = useQuery(GET_LISTING, {
    variables: { id: Number(listingId) },
    fetchPolicy: 'cache-and-network'
  });

  useEffect(() => {
    if (!loading) {
      // Create a variable for listing and set it to the data recieved
      const currentListing = data.listing;

      setListing(currentListing);

      setBookings(currentListing.bookings)

      updateBlockedDates(currentListing.bookings);
      
    } 
  }, [loading])

  let selectionRange = {
    startDate: dateRange.startDate,
    endDate: dateRange.endDate,
    key: 'selection',
    
  }

  const updateBlockedDates = (checkBookings) => {
    const blockedDatesArr = [];
    const blockedDatesStrArr = [];
    for(const booking of checkBookings) {
      let currentDate = moment(booking.start_date);
      let stopDate = moment(booking.end_date)
      while(currentDate <= stopDate) {
        blockedDatesArr.push(new Date(currentDate))
        blockedDatesStrArr.push(moment(new Date(currentDate)).format("MM-DD-YYYY"));
        currentDate = moment(currentDate).add(1, 'days');
      }
    }
    setBlockedDates(blockedDatesArr);
    let currentStartDate = moment(dateRange.startDate);
    while(blockedDatesStrArr.includes(moment(currentStartDate).format("MM-DD-YYYY"))) {
      currentStartDate = moment(currentStartDate).add(1, 'days');
    }
    setDateRange({...dateRange, startDate: new Date(currentStartDate), endDate: new Date(currentStartDate)});
  }

  // Wait for values to be returned from GraphQL
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error : {error.message}</p>;

  const bookingHistory = bookings.map((booking, i) => {
    return (
      <tr key={i}>
        <td>{booking.user.first_name} {booking.user.last_name}</td>
        <td>{moment(booking.start_date).format("MM/DD/YYYY")}</td>
        <td>{moment(booking.end_date).format("MM/DD/YYYY")}</td>
      </tr>
    )
  })

  const handleDateSelect = (ranges) =>{
    setDateRange(ranges.selection)
  }

  return(
    
    <div className="text-center py-4">
      <img className="object-fit-cover border rounded" src={listing.image_url} alt="listing image" height="500" width="75%"/>
      <div className="row">
        <div className="card col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
          <div className="card-header">
            <h6>Listing Details</h6>
          </div>
          <div className="card-body">
            <h1>{listing.name}</h1>
            <h6>{listing.description}</h6>
            <p>{listing.address}</p>
            <p>${listing.price} per night</p>
          </div>
        </div>
        <div className="card col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
          <div className="card-header">
            <h6>Book Listing</h6>
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
      
      <div className="card">
        <div className="card-header">
          <h6>Booking History</h6>
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
              {bookingHistory}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default ViewListing;