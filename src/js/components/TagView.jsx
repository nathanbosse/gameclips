'use strict';

import React, {PropTypes, StyleSheet} from 'react';
import cx from 'classnames';
import {firebaseUrl} from '../util/constants';
import ReactFireMixin from 'reactfire';
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
import Paper from 'material-ui/lib/paper';
import MenuItem from 'material-ui/lib/menus/menu-item';
import UIButton from './UIButton';
import Menu from 'material-ui/lib/menus/menu';

const baseRef = new Firebase(firebaseUrl);
const gameClipIdsRef = baseRef.child('gameClipIds');
const tagsRef = baseRef.child('tags');

const UIVideoPlayer = React.createClass({
  mixins: [ReactFireMixin],
  propTypes: {
    tagType: PropTypes.string,
    tagOptions: PropTypes.object,
    tagValue: PropTypes.string,
    titleId: PropTypes.number,
    gameclipid: PropTypes.string
  },

  getInitialState() {
    return {expanded: false, tagValue: this.props.tagValue, editable: true}
  },
  componentWillMount() {},
  componentWillReceiveProps(nextProps) {
    if (!this.props.titleId && this.props.tagValue) {
      this.setState({editable: false})
    }

    if (nextProps.tagValue) {
      this.setState({tagValue: nextProps.tagValue})
    }
  },
  expandTagOptionsDropdown() {
    if (this.state.editable) {
      this.setState({expanded: true});
    }
  },
  handleTagChange(event, value) {
    Actions.tagGameClip(this.props.gameclipid, this.props.tagType, value);

    this.setState({expanded: false, tagValue: value});
    this.forceUpdate();
  },
  hideTagMenu() {
    this.setState({expanded: false});
    this.forceUpdate();
  },
  render(node) {

    const {expanded} = this.state
    const {tagOptions} = this.props
    var tagMenuOptions = [];
    if (tagOptions) {
      var tagOptionKeys = Object.keys(tagOptions);
      if (tagOptionKeys && tagOptionKeys.length) {
        for (var i = 0; i < tagOptionKeys.length; i++) {
          tagMenuOptions.push(< MenuItem value = {
            tagOptionKeys[i]
          }
          key = {
            tagOptionKeys[i]
          }
          primaryText = {
            tagOptionKeys[i]
          } />);
        }
      }
    }

    var tagText = this.state.boundTagValue
      ? this.state.boundTagValue.value
      : this.props.tagValue || '+ tag ' + this.props.tagType + '';

    return (
      <div className='gameclip-tag'>
        {expanded
          ? <div style={{
              width: '2000px',
              height: '2000px',
              position: 'fixed',
              top: '0px',
              left: '0px'
            }} onClick={this.hideTagMenu}></div>
          : null}
        <div onClick={this.expandTagOptionsDropdown}>
          <Paper style={{
            display: 'inline-block'
          }} zDepth={1}>
            <h5 style={{
              display: 'inline-block'
            }} className="body-link">
              <span>{tagText}</span>
            </h5>
            {expanded
              ? <div>
                  <Menu desktop={true} openDirection="bottom-right" maxHeight={300} value={tagText} onChange={this.handleTagChange}>
                    {tagMenuOptions}
                  </Menu>
                </div>
              : null}

          </Paper>

        </div>
      </div>
    );

  }

});

export default UIVideoPlayer;
