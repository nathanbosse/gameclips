'use strict';

import React from 'react';
import Actions from '../actions/Actions';
const RaisedButton = require('material-ui/lib/raised-button');

const LoginLinks = () => (
    <span className="login-links">
        <a onClick={ () => Actions.showModal('login') }>Log In</a>
        <RaisedButton className="signup" onClick={ () => Actions.showModal('register') } label="Sign Up" primary={true} />
    </span>
);

export default LoginLinks;
