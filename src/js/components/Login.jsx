'use strict';

import React, { PropTypes } from 'react';
import Actions from '../actions/Actions';
import Spinner from '../components/Spinner';
const RaisedButton = require('material-ui/lib/raised-button');

const Login = React.createClass({

    propTypes: {
        user: PropTypes.object,
        errorMessage: PropTypes.string
    },

    getInitialState() {
        return {
            submitted: false,
            email: '',
            password: ''
        };
    },

    componentWillReceiveProps(nextProps) {
        if (nextProps.user !== this.props.user) {
            // clear form if user prop changes (i.e. logged in)
            this.clearForm();
        }

        // allow resubmission if error comes through
        this.setState({
            submitted: false
        });
    },

    clearForm() {
        this.setState({
            email: '',
            password: ''
        });
    },

    login(e) {
        e.preventDefault();
        const { email, password } = this.state;

        this.setState({
            submitted: true
        });

        Actions.login({
            email: email,
            password: password
        });
    },

    render() {
        const { submitted, email, password } = this.state;
        const { errorMessage } = this.props;

        const error = errorMessage && (
            <div className="error modal-form-error">{ errorMessage }</div>
        );

        return (
            <div className="login">
                <h3 className='title'>Login</h3>
                <form onSubmit={ this.login } className="modal-form">
                    <label className='form-label' htmlFor="email">Email</label>
                    <input
                        type="email"
                        placeholder="Email"
                        id="email"
                        value={ email }
                        onChange={ (e) => this.setState({ email: e.target.value.trim() }) }
                    />
                    <label className='form-label' htmlFor="password">Password</label>
                    <input
                        type="password"
                        placeholder="Password"
                        id="password"
                        value={ password }
                        onChange={ (e) => this.setState({ password: e.target.value }) }
                    />
                  <RaisedButton backgroundColor='#553285' className="btn btn-primary" onClick={ () => Actions.showModal('register') } label="Sign In" primary={true} />

                </form>
                { error }
            </div>
        );
    }
});

export default Login;
