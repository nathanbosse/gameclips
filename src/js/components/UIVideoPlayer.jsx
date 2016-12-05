'use strict';

import React, {PropTypes, StyleSheet} from 'react';
import cx from 'classnames';
import ReactDOM from 'react-dom';

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

const AutoplayListener = React.createClass({

  propTypes: {
    width: PropTypes.string,
    height: PropTypes.string,
    show: PropTypes.array,
    videoLoadedCallback: PropTypes.func,
    errorCallback: PropTypes.func
  },

  getInitialState() {
    return {index: 0, loaded: true, autoPlay: true, show: ['']}
  },

  componentWillReceiveProps(nextProps) {
    this.setState({show: nextProps.show, loaded: true});
    this.forceUpdate();
  },
  videoLoaded() {
    if (!this.state.loaded) {
      this.setState({loaded: true});
      this.props.videoLoadedCallback(this.state.index);
    }
  },
  nextVideo() {

    if (this.state.loaded) {
      var currentIndex = this.state.index;
      var nextIndex = currentIndex + 1;
      if (nextIndex === this.props.show.length) {
        nextIndex = 0;
        this.setState({autoPlay: false});
      }
      this.setState({
        index: nextIndex,
        loaded: false
      }, function() {
        var videoElement = this.videoComponent.getDOMNode().getElementsByTagName('video')[0];
        videoElement = ReactDOM.findDOMNode(this.videoComponent).getElementsByTagName('video')[0];

        // videoElement.setAttribute('autoplay', this.state.autoPlay ? true : '');
        videoElement.load();
      });
      this.forceUpdate();
    }
  },
  previousVideo() {
    var currentIndex = this.state.index;
    var nextIndex = currentIndex - 1;
    this.setState({index: nextIndex});
  },
  loadVideoAtIndex(newIndex) {
    this.setState({
      index: newIndex
    }, function() {
      var videoElement = this.videoComponent.getDOMNode().getElementsByTagName('video')[0];
      videoElement = ReactDOM.findDOMNode(this.videoComponent).getElementsByTagName('video')[0];
      // videoElement.setAttribute('autoplay', this.state.autoPlay ? true : '');

      videoElement.load();
    });
    this.forceUpdate();
  },

  render(node) {
    const {show} = this.props;
    // const index = this.state.index;
    const index = this.state.index;
    return (
      <Video errorCallback={this.props.errorCallback} controls preload autoPlay={this.state.autoPlay
        ? true
        : false} ref={(ref) => this.videoComponent = ref}>
        <source src={show[index]} type="video/mp4"/>

        <Overlay/>
        <Controls>
          <Play/>
          <Seek/>
          <Time/>
          <AutonextListener nextVideoCallback={this.nextVideo} videoLoadedCallback={this.videoLoaded}/>
          <Mute/>
          <Fullscreen/>
        </Controls>

      </Video>
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

export default AutoplayListener;
