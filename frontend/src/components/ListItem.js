import React from 'react';
import './listItem.css';
import { Star } from '@material-ui/icons';

const ListItem = ({ pin, i }) => {
  return (
    <>
      <div className="list-item-container">
        <div className="filter-pins-container">
        </div>
        <div className="number-container">{i + 1}</div>
        <div className="item-container">
          <div className="list-place-container">
            <label>Place</label>
            <div className="list-room-container">
              <div className="list-place-container">{pin.title}</div>
            </div>
          </div>
          <div className="list-rating-container">
            <label>Review</label>
            <div className="list-rating">
              {Array(pin.rating).fill(<Star className="star" />)}
            </div>
          </div>
          <div className="list-creator-container">
            <label>Information</label>
            <span className="username">
              Created by <b>{pin.username}</b>
            </span>
          </div>
          {/* <div className="view-pin-container">
            <button className="view-pin-button">View Pin</button>
          </div> */}
        </div>
      </div>
      <div className="line"></div>
    </>
  );
};

export default ListItem;
