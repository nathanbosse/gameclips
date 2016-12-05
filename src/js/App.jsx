/*
Project:    Good Gaming
Author:     Nathan Bosse
Author URI: http://nathanbosse.com/
====================================== */

'use strict';

var React = require('react');
window.React = React;
import { PropTypes } from 'react';

import Reflux from 'reflux';
import { Link, Router } from 'react-router';

import Actions from './actions/Actions';

import UserStore from './stores/UserStore';
import ModalStore from './stores/ModalStore';

import Posts from './views/Posts';
import Browse from './views/Browse';
import Modal from './components/Modal';
import Login from './components/Login';
import Register from './components/Register';
import NewPost from './components/NewPost';
import LoginLinks from './components/LoginLinks';
import ProfileLink from './components/ProfileLink';
import Icon from './components/Icon';
import UIButton from './components/UIButton';
import UISideMenu from './components/UISideMenu';

const RaisedButton = require('material-ui/lib/raised-button');
const ToolbarSeparator = require('material-ui/lib/toolbar/toolbar-separator');

import { Grid, Col, Row } from 'react-bootstrap';

const IconButton = require('material-ui/lib/icon-button');
const FontIcon = require('material-ui/lib/font-icon');
const AppBar = require('material-ui/lib/app-bar');
const FlatButton = require('material-ui/lib/flat-button');
const MenuItem = require('material-ui/lib/menus/menu-item');
const IconMenu = require('material-ui/lib/menus/icon-menu');
const AutoComplete = require('material-ui/lib/auto-complete');

import GlobalsStore from './stores/GlobalsStore';


let injectTapEventPlugin = require("react-tap-event-plugin");
//Needed for onTouchTap
injectTapEventPlugin();

const App = React.createClass({

    propTypes: {
        children: PropTypes.object
    },

    mixins: [
        Reflux.listenTo(UserStore, 'onStoreUpdate'),
        Reflux.listenTo(ModalStore, 'onModalUpdate'),
        Reflux.listenTo(GlobalsStore, 'globalsUpdated'),
        Router.State
    ],
    childContextTypes: {
      currentGameClipId: React.PropTypes.string
    },
    getChildContext: function() {
      return {currentGameClipId: this.state.currentGameClipId};
    },
    getInitialState() {
        var viewType = GlobalsStore.getDefaultData().viewType || 0;
        return {
            user: UserStore.getDefaultData(),
            modal: ModalStore.getDefaultData(),
            showHeader: false,
            showLeftNav: false,
            forceShowLeftNav: false,
            mobileDevice: !window.matchMedia( "(min-width: 768px)" ).matches,
            currentGameClipId: ''

        };
    },

    onStoreUpdate(user) {
        this.setState({
            user: user,
            showModal: false
        });
    },

    onModalUpdate(newModalState) {
        this.setState({
            modal: newModalState
        });
    },
    globalsUpdated(requestedViewType) {
      var globalData = GlobalsStore.getDefaultData();
      this.setState({
        showHeader: globalData.showHeader,
        showLeftNav: globalData.showLeftNav,
        currentGameClipId: globalData.currentGameClip
      });
      this.forceUpdate();
    },
    hideModal(e) {
        if (e) { e.preventDefault(); }
        Actions.hideModal();
    },

    newPost() {
        if (this.state.user.isLoggedIn) {
            Actions.showModal('newpost');
        } else {
            Actions.showModal('login', 'LOGIN_REQUIRED');
        }
    },
    toggleSideMenu() {
      this.refs.leftPanel.toggleSideMenu();
      this.forceUpdate();

    },


    getModalComponent(modal) {
        if (!modal.type) {
            return null;
        }

        let modalInner = null;
        const modalProps = {
            user: this.state.user,
            errorMessage: modal.errorMessage
        };


        switch (modal.type) {
            case 'register':
                modalInner = <Register { ...modalProps } />; break;
            case 'login':
                modalInner = <Login { ...modalProps } />; break;
            case 'newpost':
                modalInner = <NewPost { ...modalProps } />;
        }

        return (
            <Modal hideModal={ this.hideModal }>
                { modalInner }
            </Modal>
        );
    },
    newSearchRequest(t) {
      this.props.history.pushState(null, '/gamertag/'+t);
      this.setState({
        forceShowLeftNav: false
      });
    },
    shouldShowLeftNav() {
      var shouldShow = this.state.showLeftNav && !this.state.mobileDevice;
      return shouldShow;
    },
    render() {
        const { user, modal, showHeader, showLeftNav, forceShowLeftNav } = this.state;
        var mobileDevice = !window.matchMedia( "(min-device-width: 768px)" ).matches;


        return (
        <div className="wrapper full-height">

          {showHeader ? <header className="hidden-xs hidden-sm header cf">
            <Grid>
              <Row>
                <Col xs={12} md={12}>
                  <div className="float-left navbar-section">
                    <Link to="/" className="menu-title">
                      <span>gameclips.io</span>
                    </Link>
                  </div>
                  <div className="float-right navbar-section">
                    <div style={{display: 'inline-block'}}>
                    <AutoComplete
                      fullWidth={true}
                      hintText = "Gamertag Search"
                      onUpdateInput={(t) => {
                        console.log(t);
                        this.state.input2=this.setState({input2: t});
                      }}
                      showAllItems = {true}
                      dataSource={[this.state.input2]}
                      onNewRequest={(t) => this.newSearchRequest(t)}
                    />
                    </div>
                    <Link to="/browse/1" className="menu-title">
                      <span>Browse</span>
                    </Link>
                    <ToolbarSeparator/>
                    {user.isLoggedIn
                      ? <ProfileLink user={user}/>
                      : <LoginLinks/>}
                  </div>
                </Col>
              </Row>
            </Grid>
          </header> : null}
          {mobileDevice ? <header className="header cf">
            <Grid>
              <Row>
                <Col xs={12} md={12}>

                  <div className="float-left navbar-section">
                    <div onClick={this.toggleSideMenu} style={{display: 'inline-block'}}><IconButton iconClassName="material-icons" tooltipPosition="bottom-center"
   tooltip="Toggle Menu" style={{marginTop: '8px'}}>menu</IconButton></div>
                    <Link to="/" className="menu-title">
                      <span>gameclips.io</span>
                    </Link>
                  </div>

                </Col>
              </Row>
            </Grid>
          </header> : null}
          {true ? <div id="left-panel"><UISideMenu ref="leftPanel" docked={this.shouldShowLeftNav()} open={this.shouldShowLeftNav()}>
          <div className="menuItem">
              <Link to="/" className="menu-title">
                <div className="logo-image"></div>
                <span className="caption">gameclips.io</span>
              </Link>
          </div>
            <div className="dark-bg autocomplete">
              <AutoComplete
              fullWidth={true}
              hintText = "Gamertag Search"
              onUpdateInput={(t) => {
                console.log(t);
                this.state.input=this.setState({input: t});
              }}
              showAllItems = {true}
              dataSource={[this.state.input]}
              onNewRequest={(t) => this.newSearchRequest(t)}
            /></div>
          <h5 style={{margin: '8px 16px'}} className="sub-title dark-bg">BROWSE</h5>
            <MenuItem className="menuitem" index={0}>Games</MenuItem>
            <MenuItem className="menuitem" index={1}>Collections</MenuItem>

          <hr style={{margin: '16px'}}></hr>
            {user.isLoggedIn
              ? <div id="left-panel-user-profile"><ProfileLink user={user}/></div>
            : <div id="left-panel-login-links">
        <a className="body-link" onClick={ () => Actions.showModal('login') }>Log In</a>
        <RaisedButton backgroundColor='#553285' className="signup" onClick={ () => Actions.registerWithLiveOAuth() } label="Sign Up" primary={true} />
    </div>}
            </UISideMenu></div> : null}
          {this.props.children || <Posts/>}


          {this.getModalComponent(modal)}


            </div>
        );
    }
});

export default App;
