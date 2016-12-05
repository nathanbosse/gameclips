'use strict';

import React, { PropTypes } from 'react';
import Actions from '../actions/Actions';
import Spinner from '../components/Spinner';
const RaisedButton = require('material-ui/lib/raised-button');

const Register = React.createClass({

    propTypes: {
        user: PropTypes.object,
        errorMessage: PropTypes.string
    },

    getInitialState() {
        return {
            submitted: false,
            username: '',
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
            username: '',
            email: '',
            password: ''
        });
    },

    registerUser(e) {
        e.preventDefault();
        const { username, email, password } = this.state;

        if (!username) {
            return Actions.modalError('NO_USERNAME');
        }

        this.setState({
            submitted: true
        });

        const loginData = {
            email: email,
            password: password
        };

        Actions.register(username, loginData);
    },

    render() {
        const { submitted, username, email, password } = this.state;
        const { errorMessage } = this.props;

        const error = errorMessage && (
            <div className="error modal-form-error">{ errorMessage }</div>
        );

        return (
            <div className="register">
                <h1 className='title'>Register</h1>
                <form onSubmit={ this.registerUser } className="modal-form">
                    <label className='form-label' htmlFor="username">Gamertag</label>
                    <input
                        type="text"
                        placeholder="Gamertag"
                        id="username"
                        value={ username }
                        onChange={ (e) => this.setState({ username: e.target.value }) }
                    />
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

                    <RaisedButton type="submit" backgroundColor='#553285' className="btn btn-primary" label="Register" primary={true} />

                </form>
                { error }
            </div>
        );
    }

});

export default Register;
