import React from 'react';
import { connect } from 'react-redux';
import { RentalDetailInfo } from './RentalDetailInfo';
import RentalMap from './RentalMap';
import Booking from 'components/booking/Booking';
import StarRatings from 'react-star-ratings';


import * as actions from 'actions';

class RentalDetail extends React.Component {

  state ={
    reviews:[]
  }

  componentWillMount() {
    // Dispatch action
    const rentalId = this.props.match.params.id;

    this.props.dispatch(actions.fetchRentalById(rentalId))
    .then((rental)=>{
      this.getReviews(rental._id)
    });
  }

  getReviews = (rentalId) =>{
    actions.getReviews(rentalId)
    .then((reviews)=>{
      this.setState({reviews});
    })
  }

  render() {
    const { rental, username} = this.props;
    const {reviews} = this.state;

    if (rental._id) {
      return (
        <section id="rentalDetails">
          <div className="upper-section">
            <div className="row">
              <div className="col-md-6">
                <img src={rental.image} alt=""></img>
              </div>
              <div className="col-md-6">
                <RentalMap location={`${rental.city}, ${rental.street}`} />
              </div>
            </div>
          </div>

          <div className="details-section">
            <div className="row">
              <div className="col-md-8">
                <RentalDetailInfo rental={rental} username={username} />
              </div>
              <div className="col-md-4">
                <Booking rental={rental} />
              </div>
            </div>
            {reviews && reviews.length>0 &&
            <div className="row">
              <div className="col-md-8">
                <section style={{ marginBottom: "40px" }}>
                  <h2>Reviews</h2>
                  {reviews.map(review=>
                    <div key={review._id} className="card review-card">
                      <div className="card-body">
                        <div className="row">
                          <div className="col-md-2 user-image">
                            <img
                              src="https://image.ibb.co/jw55Ex/def_face.jpg"
                              className="img img-rounded img-fluid"
                            />
                            <p className="text-secondary text-center">
                              {review.createdAt}
                            </p>
                          </div>
                          <div className="col-md-10">
                            <div>
                              <a>
                                <strong>{review.user.username}</strong>
                              </a>
                              <div className="review-section">
                                <StarRatings
                                  rating={review.rating}
                                  starRatedColor="orange"
                                  starHoverColor="orange"
                                  starDimension="25px"
                                  starSpacing="2px"
                                  numberOfStars={5}
                                  name="rating"
                                />
                              </div>
                            </div>
                            <div className="clearfix"></div>
                            <p>{review.text}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </section>
              </div>
            </div>
            }
          </div>
        </section>
      );
    } else {
      return (
        <h1> Loading... </h1>
        )
    }
  }
}

function mapStateToProps(state) {
  return {
    rental: state.rental.data,
    errors: state.rental.errors,
    username:  state.auth.username
  }
}

export default connect(mapStateToProps)(RentalDetail)
