'use strict';

import React, {PropTypes, StyleSheet} from 'react';
import cx from 'classnames';

import Actions from '../actions/Actions';
const FontIcon = require('material-ui/lib/font-icon');
const IconButton = require('material-ui/lib/icon-button');

const LeftNav = require('material-ui/lib/left-nav');

const UISideMenu = React.createClass({

  propTypes: {
    alignment: PropTypes.string,
    open: PropTypes.bool,
    docked: PropTypes.bool
  },

  getInitialState() {
    return {
      alignment: this.props.alignment || 'left',
      open: this.props.open || false
    }
  },
  leftNavClosed() {
    this.setState({open: false});

  },
  toggleSideMenu() {
    if (this.refs.leftNavChildren.state.open) {
      this.refs.leftNavChildren.close();
    } else {
      this.refs.leftNavChildren.open();
    }
  },
  componentWillReceiveProps(nextProps) {
    // var newOpenState = !this.refs.leftNavChildren.state.open === nextProps.open;
    // this.setState({
    //   open: nextProps.open
    // });
    // if (newOpenState) {
    //   if (nextProps.open) {
    //     this.refs.leftNavChildren.open();
    //   } else {
    //     this.refs.leftNavChildren.close();
    //   }
    // }

  },
  render(node) {

    var leftAligned = {
      backgroundColor: '#22226B',
      width: '240px',
      boxShadow: 'none',
      left: '0px'
    };
    var rightAligned = {
      backgroundColor: '#22226B',
      width: '240px',
      boxShadow: 'none',
      right: '0px'
    };
    const {alignment, open} = this.state;

    var docked = window.matchMedia("(min-width: 768px)").matches && this.props.docked;
    return (
      <LeftNav style={{
        backgroundColor: 'inherit',
        width: '240px',
        boxShadow: 'none'
      }} openRight={alignment === 'right'} ref="leftNavChildren" docked={docked} onNavClose={this.leftnavClosed} disableSwipeToOpen={!docked}>
        {this.props.children}
      </LeftNav>
    );

  }

});

// Sample Code
// <UIButton
//   type="primary"
//   materialIcon="add"
//   className="primary"
//   tooltip="new post">
// </UIButton>

export default UISideMenu;
