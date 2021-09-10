import React, { useRef, useEffect } from 'react';
import './notification.css';
import gsap from 'gsap';

const Notification = () => {
  const notificationRef = useRef();

  const notificationContainer = document.getElementById(
    'notification-container'
  );

  const closePopup = () => {
    notificationContainer.classList.add('hide');
  };

  useEffect(() => {
    gsap.to(notificationRef.current, { x: 35 });
  }, []);

  return (
    <div
      className="notification-container"
      id="notification-container"
      style={{ zIndex: '500' }}
      ref={notificationRef}
    >
      <div className="exclamation-container">
        <i className="fas fa-exclamation"></i>
      </div>
      <div className="right-notification">
        <p>Double click to add a pin.</p>
        <div className="exit-container" onClick={closePopup}>
          <i className="fas fa-times"></i>
        </div>
      </div>
    </div>
  );
};

export default Notification;
