import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { BookingCard, PaymentCard } from './BookingCard';
import {ReviewModal} from 'components/review/ReviewModal';
import * as actions from 'actions';
import {isExpired} from 'helpers';
import Booking from '../Booking';

class BookingManage extends React.Component {

  state = {
    pendingPayments: []
  }

  componentDidMount() {
    this.props.dispatch(actions.fetchUserBookings());
    this.getPendingPayments();
  }

  getPendingPayments() {
    actions.getPendingPayments()
      .then(pendingPayments => this.setState({pendingPayments}))
      .catch(err => console.error(err));
  }

  acceptPayment(payment) {
    actions.acceptPayment(payment)
      .then(status => {
        this.getPendingPayments();
      })
      .catch(err => console.error(err))
  }

  declinePayment(payment) {
    actions.declinePayment(payment)
      .then(status => {
        this.getPendingPayments();
      })
      .catch(err => console.error(err))
  }

  handleReviewCreated = (review,updatedBooking) =>{
    const {dispatch} = this.props;
    const {data: bookings} = this.props.userBookings;
    const index = bookings.findIndex((booking)=>booking._id===updatedBooking._id);
    updatedBooking.review = review;
    bookings[index]=updatedBooking;
    dispatch(actions.updateBookings(bookings));
  }

  renderBookings(bookings) {
    return bookings.map((booking, index) => 
    <BookingCard booking={booking} 
                 key={index} 
                 hasReview={!!booking.review}
                 isExpired={isExpired(booking.endAt)}
                 reviewModal={()=>
                 <ReviewModal 
                 bookingId={booking._id}
                 onReviewCreated={(review)=>{
                  this.handleReviewCreated(review,booking)
                }}
                />
               }
              />);
  }

  renderPayments(payments) {
    return payments.map((payment, index) => <PaymentCard booking={payment.booking}
                                                         payment={payment}
                                                         paymentBtns={this.renderPaymentButtons}
                                                         key={index} />);
  }

  renderPaymentButtons = (payment) => {
    return (
      <div>
        <button onClick={() => this.acceptPayment(payment)} className="btn btn-success">Accept</button>{' '}
        <button onClick={() => this.declinePayment(payment)} className="btn btn-danger">Decline</button>
      </div>
    )
  }

  render() {
    const { data: bookings, isFetching } = this.props.userBookings;
    const { pendingPayments } = this.state;

    return (
      <React.Fragment>
        <section id="userBookings">
          <h1 className="page-title">My Bookings</h1>
          <div className="row">
          { this.renderBookings(bookings) }
          </div>
          { !isFetching && bookings.length === 0 &&
            <div className="alert alert-warning">
              You have no bookings created go to rentals section and book your place today.
              <Link style={{'marginLeft': '10px'}} className="btn btn-bwm" to="/rentals">Available Rental</Link>
            </div>
          }
        </section>
        <section id="pendingBookings">
          <h1 className="page-title">Pending Bookings</h1>
          <div className="row">
          { this.renderPayments(pendingPayments) }
          </div>
          { !isFetching && pendingPayments.length === 0 &&
            <div className="alert alert-warning">
              You have no pending bookings currently...
            </div>
          }
        </section>
      </React.Fragment>
    )
  }
}

function mapStateToProps(state) {
  return {
    userBookings: state.userBookings
  }
}

export default connect(mapStateToProps)(BookingManage)
