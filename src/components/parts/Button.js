import React, {PropTypes} from 'react';

const Button = ({id, className, text, onClick}) => (
  <button id={id} className={className} onClick={onClick}>
    {text}
  </button>
);
  
Button.propTypes = {
  id: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  className: PropTypes.string.isRequired,
  onClick: PropTypes.func

};

export default Button;