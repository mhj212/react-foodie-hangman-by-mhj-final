import React, {PropTypes} from 'react';

const top = tries => (<div>_______</div>);
const rope = tries => (<div>|/{'\u00A0'}{'\u00A0'}{'\u00A0'}{'\u00A0'}{'\u00A0'}<span className={tries < 8 ? '' : 'visibility-hidden'}>|</span></div>);
const head = tries => (<div>|{'\u00A0'}{'\u00A0'}{'\u00A0'}{'\u00A0'}{'\u00A0'}<span className={ tries < 7 ? '' : 'visibility-hidden'}>(_)</span></div>);
const arms = tries => (<div>|{'\u00A0'}{'\u00A0'}{'\u00A0'}{'\u00A0'}{'\u00A0'}<span className={ tries < 5 ? '' : 'visibility-hidden'}>\</span><span className={ tries < 6 ? '' : 'visibility-hidden'}>|</span><span className={ tries < 4 ? '' : 'visibility-hidden'}>/</span></div>);
const torso = tries => (<div>|{'\u00A0'}{'\u00A0'}{'\u00A0'}{'\u00A0'}{'\u00A0'}{'\u00A0'}<span className={ tries < 3 ? '' : 'visibility-hidden'}>|</span></div>);
const legs = tries => (<div>|{'\u00A0'}{'\u00A0'}{'\u00A0'}{'\u00A0'}{'\u00A0'}<span className={ tries < 2 ? '' : 'visibility-hidden'}>/</span> <span className={ tries < 1 ? '' : 'visibility-hidden'}>\</span></div>);
const pillar = tries => (<div>|</div>);
const base = tries => (<div>|___</div>);

const HangmanDrawing = ({tries}) => (
  <div className="drawing">
    {top(tries)}
    {rope(tries)}
    {head(tries)}
    {arms(tries)}
    {torso(tries)}
    {legs(tries)}
    {pillar(tries)}
    {base(tries)}
  </div>
);
  
HangmanDrawing.propTypes = {
  tries: PropTypes.number
};

export default HangmanDrawing;