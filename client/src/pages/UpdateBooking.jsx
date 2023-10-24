import React, { useEffect, useState } from "react";
import { useMutation, useQuery, gql } from "@apollo/client";
import moment from "moment";
import { DateRange } from "react-date-range";
import { useNavigate, useParams } from "react-router-dom";

const GET_BOOKING = gql`
query GetBooking($id: Int!){
  booking(id: $id){
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

const UPDATE_BOOKING = gql`
mutation UpdateBooking($id: Int!, $start_date: Date!, $end_date: Date!){
  updateBooking(id: $id, start_date: $start_date, end_date: $end_date) {
    id
  }
}
`;

const UpdateBooking = (props) => {
  const [booking, setBooking] = useState({});
  const [currentListing, setCurrentListing] = useState({});
  const [blockedDates, setBlockedDates] = useState([]);
  const [bookingUpdated, setBookingUpdated] = useState(false);


  const [dateRange, setDateRange] = useState({
    startDate: new Date(),
    endDate: new Date(),
    key: "selection"
  });

  const [updateBooking, updatedBooking] = useMutation(UPDATE_BOOKING);

  const navigate = useNavigate();

  const { bookingId } = useParams()

  const onSubmit = (event) => {
    event.preventDefault();
    updateBooking({
      variables: {
        id: booking.id, start_date: dateRange.startDate, end_date: dateRange.endDate
      }
    }).then(() => {
      setBooking({...booking, start_date: dateRange.startDate, end_date: dateRange.endDate});
      setBookingUpdated(true);
      props.closeModal(false);
    }).catch((err) => {
      console.log(err.message);
    })
  };

  const handleDateSelect = (ranges) =>{
    setDateRange(ranges.selection);
  };

  const navigateToHistory = () => {
    navigate("/history");
  };

  // Query to get the listing data via GraphQL
  const { loading, error, data } = useQuery(GET_BOOKING, {
    variables: { id: Number(bookingId) },
    fetchPolicy: 'cache-and-network'
  });

  useEffect(() => {
    if(!loading) {
      setBooking({...booking, id: data.booking.id, startDate: data.booking.startDate, endDate: data.booking.endData});

      setCurrentListing({...currentListing, name: data.booking.listing.name, description: data.booking.listing.description, address: data.booking.listing.address, price: data.booking.listing.price});

      updateBlockedDates(data.booking.listing.bookings, data.booking);
    }
  }, [loading]);

  const updateBlockedDates = (checkBookings, currentBooking) => {
    const blockedDatesArr = [];
    const blockedDatesStrArr = [];
    for(const booking of checkBookings) {
      let currentDate = moment(booking.start_date);
      let stopDate = moment(booking.end_date)
      if(moment(new Date(currentDate)).format("MM-DD-YYYY") != moment(currentBooking.start_date).format("MM-DD-YYYY")) {
        while(currentDate <= stopDate) {
          blockedDatesArr.push(new Date(currentDate))
          blockedDatesStrArr.push(moment(new Date(currentDate)).format("MM-DD-YYYY"));
          currentDate = moment(currentDate).add(1, 'days');
        }
      }
    }
    setBlockedDates(blockedDatesArr);
    setDateRange({...dateRange, startDate: new Date(currentBooking.start_date), endDate: new Date(currentBooking.end_date)});
  }

  // Wait for values to be returned from GraphQL
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error : {error.message}</p>;

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