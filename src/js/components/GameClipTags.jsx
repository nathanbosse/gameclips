'use strict';

import React, {PropTypes, StyleSheet} from 'react';
import cx from 'classnames';

import Actions from '../actions/Actions';
const FontIcon = require('material-ui/lib/font-icon');
const IconButton = require('material-ui/lib/icon-button');
import {
  default as Video,
  Controls,
  Play,
  Mute,
  Seek,
  Fullscreen,
  Time,
  Overlay
} from 'react-html5video';
import AutonextListener from './AutonextListener';

import UIButton from './UIButton';

const UIVideoPlayer = React.createClass({

  propTypes: {
    percentagePlayed: PropTypes.number,
    nextVideoCallback: PropTypes.func
  },

  getInitialState() {
    return {percentagePlayed: this.props.percentagePlayed, nextVideoCallback: this.props.nextVideoCallback, videoLoadedCallback: this.props.videoLoadedCallback}
  },

  componentWillReceiveProps(nextProps) {
    if (nextProps.percentagePlayed > 99) {
      this.state.nextVideoCallback();
    } else if (nextProps.percentagePlayed < 1) {
      this.state.videoLoadedCallback();
    }
  },

  nextVideo() {},
  previousVideo() {},

  render(node) {
    return (
      <div></div>
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

export default UIVideoPlayer;
