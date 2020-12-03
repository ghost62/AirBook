import React from 'react';
import Modal from 'react-responsive-modal';
import StarRatings from 'react-star-ratings';
import * as actions from 'actions'
export class ReviewModal extends React.Component {
 
    state ={
        open: false,
        text:'',
        rating: 3
    }

    closeModal=()=>{
      this.setState({open:false});  
    }

    publishReview = () =>{
      const {text, rating} = this.state;
      const {bookingId, onReviewCreated} = this.props;
      actions.createReview({rating, text}, bookingId)
      .then(review=>{
        onReviewCreated(review);
        this.closeModal();
      })
    }
    
    openModal=()=>{
        this.setState({open:true});
    }

    handleText = (e) =>{
        this.setState({text:e.target.value})
    }

    changeRating=( newRating, name )=> {
        this.setState({
          rating: newRating
        });
    }
          
 render(){
    const { open, text, rating} = this.state;
    return (
        <React.Fragment>
        <button className="btn btn-bwm" style={{marginLeft:'10px'}} onClick={this.openModal}>Review</button>
        <Modal open={open} onClose={this.closeModal} little classNames={{ modal: 'review-modal' }}>
         <h4 className='modal-title title'>Write a review </h4>
        <div className='modal-body'>
         <textarea value={text}
                   style={{marginBottom:'10px'}} 
                   onChange={this.handleText}
                   className='form-control'
                   placeholder='Write your experience with the place'
                   rows={3}
                   cols={50}>

         </textarea>
         <StarRatings
          rating={rating}
          starRatedColor="orange"
          starHoverColor = "red"
          starDimension="25px"
          starSpacing="2px"
          changeRating={this.changeRating}
          numberOfStars={5}
          name='rating'
         />
        </div>
        <div className='modal-footer'>
          <button disabled={!text || !rating} onClick={this.publishReview} type='button' className='btn btn-bwm'>Confirm</button>
          <button type='button' onClick={this.closeModal} className='btn btn-bwm'>Cancel</button>
        </div>
      </Modal>
      </React.Fragment>
      )
 }
  
}
