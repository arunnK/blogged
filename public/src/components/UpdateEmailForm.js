import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';

class UpdateEmailForm extends Component {
  static contextTypes = {
    router: PropTypes.object,
  };

  componentWillUnmount() {
    // Important: If you are reusing a component that might have some 
    // state (like error), you should reset it
    // either here or in componentWillMount
    this.props.resetMe();
  }

  getMessage() {
    const { error, emailUpdated } = this.props.updateEmail;
    if (error) {
      return <div className="alert alert-danger">{error.message}</div>
    } else if (emailUpdated) {
      return <div className="alert alert-info">Email was updated </div>
    } else {
      return <span/>
    }
  }

  render() {
    const { asyncValidating, fields: { email }, handleSubmit, submitting } = this.props;

    return (
      <form onSubmit={handleSubmit(this.props.validateAndUpdateEmail.bind(this))}>
        {this.getMessage()}
        <div className={`form-group ${email.touched && email.invalid ? 'has-error' : ''}`}>
          <label className="control-label">Update Email*</label>
          <input type="email" className="form-control" {...email} />
          <div className="help-block">
            {email.touched ? email.error : ''}
          </div>
          <div className="help-block">
            {asyncValidating === 'email' ? 'validating..' : ''}
          </div>
        </div>

        <button type="submit" className="btn btn-primary" disabled={submitting} >Update Email</button>
      </form>
    );
  }
}

export default UpdateEmailForm;
