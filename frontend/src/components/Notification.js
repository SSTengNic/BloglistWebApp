import React, { useState, useEffect } from 'react';

const Notification = ({ message }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    setVisible(true); // Set visible to true whenever a new message is received
    const timer = setTimeout(() => {
      setVisible(false);
    }, 3000);

    return () => clearTimeout(timer); // Clear the timer when the component unmounts
  }, [message]); // Re-run the effect whenever the message changes

  return visible ? <h2>{message}</h2> : null;
};

export default Notification;