import React from 'react';
import './Countdown.css';

const Countdown = ({ value }) => {
  return (
    <div className="countdown">
      {value}
    </div>
  );
};

export default Countdown;