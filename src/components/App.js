// This component handles the App template used on every page.
import React, {PropTypes} from 'react';

class App extends React.Component {
  render() {
    return (
      <div className="container-fluid">
        {this.props.children}
      </div>
    );
  }
}

App.propTypes = {
  children: PropTypes.object.isRequired
};

// function mapStateToProps(state, ownProps) {
//   return {
//     loading: state.ajaxCallsInProgress > 0
//   };
// }

export default App;
