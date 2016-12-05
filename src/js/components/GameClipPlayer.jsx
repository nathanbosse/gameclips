'use strict';

import React, {PropTypes, StyleSheet} from 'react';
import cx from 'classnames';
import {Link} from 'react-router';
import ReactFireMixin from 'reactfire';

import Actions from '../actions/Actions';
const FontIcon = require('material-ui/lib/font-icon');
const IconButton = require('material-ui/lib/icon-button');

import AutonextListener from './AutonextListener';

import UIVideoPlayer from './UIVideoPlayer';
import TagView from './TagView';
import {firebaseUrl} from '../util/constants';

let baseRef = new Firebase(firebaseUrl);
let tagsRef = baseRef.child('tags');
let gameClipIdsRef = baseRef.child('gameClipIds');
let titlesRef = baseRef.child('titles');

const GameClipPlayer = React.createClass({
  mixins: [ReactFireMixin],
  propTypes: {
    gameclips: PropTypes.array,
    showSingleClipLinks: PropTypes.bool,
    title: PropTypes.string
  },

  getInitialState() {
    return {
      index: 0,
      gameclips: this.props.gameclips,
      loaded: true,
      showSingleClipLinks: true,
      currentGameClip: {
        Id: -1
      }
    }
  },
  componentWillMount() {
    if (this.props.gameclips.length) {
      Actions.updateCurrentGameClipId(this.props.gameclips[0].Id);
      this.bindAsObject(tagsRef.child(this.props.gameclips[0].TitleId), "titleTags");
      this.bindAsObject(gameClipIdsRef.child(this.props.gameclips[0].Id).child('Tags'), "gameClipTagValues");
      this.fetchTitleNameForTitleId(this.props.gameclips[0].TitleId);
    }
  },
  componentWillReceiveProps(nextProps) {
    var _showSingleClipLinks = true;
    if (typeof nextProps.showSingleClipLinks !== 'undefined') {
      _showSingleClipLinks = nextProps.showSingleClipLinks;
    }
    if (this.props.gameclips.length !== nextProps.gameclips.length || this.props.gameclips[this.state.index] !== nextProps.gameclips[this.state.index]) {
      //Rebind to new firebase data
      this.unbind("titleTags");
      this.unbind("gameClipTagValues");
      this.bindAsObject(tagsRef.child(nextProps.gameclips[this.state.index].TitleId), "titleTags");
      this.bindAsObject(gameClipIdsRef.child(nextProps.gameclips[this.state.index].Id).child('Tags'), "gameClipTagValues");
      this.fetchTitleNameForTitleId(nextProps.gameclips[this.state.index].TitleId);
      this.setState({gameclips: nextProps.gameclips, loaded: true, showSingleClipLinks: _showSingleClipLinks});
      this.forceUpdate();
    }
  },
  fetchTitleNameForTitleId(titleId) {
    var self = this;
    titlesRef.child(titleId).child('title').once('value', function(snap) {
      self.setState({titleName: snap.val()})
    })
  },
  videoLoadedAtIndex(videoIndex) {
    Actions.trackViewForGameClip(this.props.gameclips[this.state.index]);
    if (this.state.currentGameClip.TitleId !== this.props.gameclips[videoIndex].TitleId) {
      this.unbind("titleTags");
      this.unbind("gameClipTagValues");
      this.bindAsObject(tagsRef.child(this.props.gameclips[videoIndex].TitleId), "titleTags");
      this.bindAsObject(gameClipIdsRef.child(this.props.gameclips[videoIndex].Id).child('Tags'), "gameClipTagValues");
    }
    if (this.state.index !== videoIndex) {
      this.unbind("gameClipTagValues");
      this.bindAsObject(gameClipIdsRef.child(this.props.gameclips[videoIndex].Id).child('Tags'), "gameClipTagValues");
    }
    this.fetchTitleNameForTitleId(this.props.gameclips[videoIndex].TitleId);

    this.setState({index: videoIndex, currentGameClip: this.props.gameclips[videoIndex]});
    Actions.updateCurrentGameClipId(this.props.gameclips[videoIndex].Id);
    this.forceUpdate();
  },
  loadVideoAtIndex(newIndex) {
    if (this.state.currentGameClip.TitleId !== this.props.gameclips[newIndex].TitleId) {
      this.unbind("titleTags");
      this.unbind("gameClipTagValues");
      this.bindAsObject(tagsRef.child(this.props.gameclips[newIndex].TitleId), "titleTags");
      this.bindAsObject(gameClipIdsRef.child(this.props.gameclips[newIndex].Id).child('Tags'), "gameClipTagValues");
    }
    if (this.state.index !== newIndex) {
      this.unbind("gameClipTagValues");
      this.bindAsObject(gameClipIdsRef.child(this.props.gameclips[newIndex].Id).child('Tags'), "gameClipTagValues");
    }
    this.fetchTitleNameForTitleId(this.props.gameclips[newIndex].TitleId);
    this.setState({index: newIndex, currentGameClip: this.props.gameclips[newIndex]});
    Actions.updateCurrentGameClipId(this.props.gameclips[newIndex].Id);
    this.forceUpdate();
    this.refs.UIVideoPlayer.loadVideoAtIndex(newIndex);
  },
  shouldShowVideoPlayer() {
    return this.state.loaded && this.state.gameclips.length > 0;
  },
  videoErrorCallback() {
    Actions.refreshClipUri(this.state.gameclips[this.state.index].Id);
    return
  },

  render(node) {
    const {show} = this.props;
    const {gameclips, titleTags, gameClipTagValues} = this.state;
    var gameClipsUrls;
    if (this.state.loaded) {
      gameClipsUrls = gameclips.map(function(obj) {
        return obj.ClipUri;
      });
    }
    const index = this.state.index;

    var isSingleClip = gameclips.length === 1

    var numberRegex = /\d+/

    var title = "Loading...";
    var gameTitle = '';
    var ownerName = "";
    var uploadedTime = '';
    var uploadedDate = '';
    var estimatedUploadDate = '';
    var tags = '';
    var titleId = '';
    var viewCount = 0;
    var gameclipid = '';
    var tags;
    if (gameclips[index]) {
      title = this.props.title;
      gameTitle = gameclips[index].TitleName || this.state.titleName;
      ownerName = gameclips[index].OwnerGamerTag;
      uploadedTime = gameclips[index].UploadTime;
      uploadedDate = gameclips[index].UploadDate;
      estimatedUploadDate = gameclips[index].EstimatedUploadDate || "";
      tags = gameclips[index].tags
        ? gameclips[index].tags[0]
        : '';
      viewCount = gameclips[index].ViewCount || 0;
      gameclipid = gameclips[index].Id || '';
      titleId = gameclips[index].TitleId || '';
      tags = gameclips[index].Tags;
    } else {
      title = 'No Videos Found';
    }
    var viewClipLink = this.state.showSingleClipLinks
      ? <span style={{
          float: 'left',
          display: 'inline-block'
        }}>
          -
          <Link to={'/gameclip/' + gameclipid}>
            <h5 style={{
              display: 'inline-block'
            }} className="caption">View Clip</h5>
          </Link>
        </span>
      : null
    // const index = this.state.index;

    var tagViews;
    if (this.state.titleTags) {
      var tagsArray = [];
      for (var prop in this.state.titleTags) {
        prop === '.key' || prop === '.value'
          ? null
          : tagsArray.push(prop);
      }
      tagViews = tagsArray.map(function(titleTag) {
        var tagValue = gameClipTagValues && gameClipTagValues[titleTag] && typeof gameClipTagValues[titleTag] === 'object'
          ? gameClipTagValues[titleTag].value
          : '';
        var tagOptions = titleTags && titleTags[titleTag]
          ? titleTags[titleTag]
          : '';
        return <TagView titleId={titleId} gameclipid={gameclipid} tagType={titleTag} tagOptions={tagOptions} tagValue={tagValue}></TagView>
      })
    }

    return (
      <div>
        <h1 className="headline">{title}</h1>
        <Link to={'/gamertag/' + encodeURIComponent(ownerName)}>
          <h3 className="sub-headline body-link">{ownerName}</h3>
        </Link>
        <div>{this.shouldShowVideoPlayer()
            ? <div><UIVideoPlayer show={gameClipsUrls} videoLoadedCallback={this.videoLoadedAtIndex} errorCallback={this.videoErrorCallback} ref="UIVideoPlayer"/>
                <div id="tagViews" style={{
                  float: 'left'
                }}>
                  <Link to={'/game/' + titleId}>
                    <TagView tagType="" tagValue={gameTitle}></TagView>
                  </Link>
                  {tagViews}</div>

                <h5 style={{
                  float: 'right',
                  display: 'inline-block',
                  margin: '4px'
                }} className="sub-headline">{viewCount}
                  Views</h5>
                <h5 style={{
                  clear: 'both',
                  float: 'left',
                  margin: '4px'
                }} className="caption">{uploadedTime}</h5>
                <div style={{
                  float: 'left',
                  margin: '4px'
                }}>{viewClipLink}</div>
                <div style={{
                  clear: 'both'
                }}></div>

              </div>
            : null}</div>
      </div>
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

export default GameClipPlayer;
