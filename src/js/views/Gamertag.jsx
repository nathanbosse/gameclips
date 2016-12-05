'use strict';

import React, {PropTypes} from 'react';
import Reflux from 'reflux';
import {History} from 'react-router';
import ReactFireMixin from 'reactfire';
import {firebaseUrl} from '../util/constants';

import Actions from '../actions/Actions';

import ProfileStore from '../stores/ProfileStore';
import UserStore from '../stores/UserStore';

import Spinner from '../components/Spinner';
import Post from '../components/Post';
import Comment from '../components/Comment';
import GameClipPlayer from '../components/GameClipPlayer';
import PlaylistView from '../components/PlaylistView';
import UISideMenu from '../components/UISideMenu';
import SelectField from 'material-ui/lib/select-field';
import Paper from 'material-ui/lib/paper';

const baseRef = new Firebase(firebaseUrl);
const titlesRef = baseRef.child('titles');

import {Grid, Col, Row} from 'react-bootstrap';
const FontIcon = require('material-ui/lib/font-icon');
import XboxLiveStore from '../stores/XboxLiveStore';
import GameClipsStore from '../stores/GameClipsStore';

const Gamertag = React.createClass({

  propTypes: {
    params: PropTypes.object
  },

  mixins: [
    History,
    Reflux.listenTo(GameClipsStore, 'gameClipsUpdated'),

    ReactFireMixin
  ],

  getInitialState() {
    return {loaded: false, sortOptions: {}};
  },
  componentWillMount() {
    this.bindAsArray(titlesRef, "titleIdData");

  },
  componentDidMount() {
    Actions.showLeftNav();
    Actions.hideHeader();
    let gamertag = this.props.params.gamertag;
    Actions.getGameClipsForGamertag(gamertag);
    Actions.fetchGameClipsObject('gamertags', gamertag);

  },

  componentWillReceiveProps(nextProps) {
    let oldGamertag = this.props.params.gamertag;
    let newGamertag = nextProps.params.gamertag;

    if (oldGamertag !== newGamertag) {
      Actions.stopWatchingGameClipsObject();

      Actions.fetchGameClipsObject('gamertags', newGamertag);
      this.setState({loaded: false});
    }
  },

  componentWillUnmount() {
    Actions.stopWatchingGameClipsObject();
  },
  gameClipsUpdated(collectionData) {
    this.setState({gameclips: collectionData.gameclips, title: collectionData.parent.title, loaded: true});
    this.forceUpdate();
  },

  setGameClips(xboxData) {
    this.setState({gameclips: xboxData.gameclips, sortOptions: xboxData.sortValues, loaded: true});
    // this.forceUpdate();
  },
  setSearchGamertag(searchGamertag) {},
  updateProfileData(profileData) {},

  logout(e) {},
  titleIdSortChange(event, titleIdIndex) {
    Actions.sortByTitleId(this.state.titleIdData[titleIdIndex].titleId);
    this.setState({loaded: false})
  },
  playlistItemSelected(selectedIndex) {
    this.refs.gameClipPlayer.loadVideoAtIndex(selectedIndex);
  },
  render() {
    var self = this;
    const {gameclips} = this.state;
    if (this.state.loaded) {
      var gameClipsUrls = gameclips.map(function(obj) {
        return obj.ClipUri;
      });
      var index = 5;
      if (!gameClipsUrls) {
        gameClipsUrls = [];
        gameClipsUrls[5] = 'http://gameclipscontent-d2012.xboxlive.com/0009000000341b2f-002c7c76-85b3-449b-9685-9d24e7ee284f/GameClip-Original.MP4?sv=2014-02-14&sr=c&sig=sCN9MluR6WZUxidALJVZNwMVoDpusGDIORaR0VQEuDY%3D&st=2015-12-13T01%3A39%3A47Z&se=2015-12-13T02%3A44%3A47Z&sp=r&__gda__=1449974687_c0cda463f7fffe345ef8b8c9ba05e599';
      }
    }
    var titleIdFilterIndex = 0;
    var sortByTitleIdValueIndex;
    var sortByTitleIdValue = self.state.titleIdData.filter(function(value) {
      if (value.titleId === self.state.sortOptions.titleIdSortValue) {
        sortByTitleIdValueIndex = titleIdFilterIndex;
      }
      titleIdFilterIndex++;

      return value.titleId === self.state.sortOptions.titleIdSortValue;
    }).pop();
    var selectedValue = this.state.titleIdData.length
      ? this.state.titleIdData[sortByTitleIdValueIndex]
      : null;
    return (
      <div id="gamertag">
        <div style={{
          height: '64px'
        }}></div>
        <br></br>
        <Grid fluid={true}>
          <Row>
            <Col xs={12} md={10} mdOffset={1}>

              <SelectField displayMember="title" labelMember="title" valueMember="titleId" value={selectedValue
                ? selectedValue.titleId
                : ''} selectedIndex={sortByTitleIdValueIndex} selectedFieldRoot={{
                color: '#553285'
              }} hintText="Filter by game" onChange={this.titleIdSortChange} menuItems={this.state.titleIdData}/>
              {this.state.loaded
                ? <div>

                    <GameClipPlayer title={this.props.params.gamertag + "'s Montage"} gameclips={gameclips} ref="gameClipPlayer"/>
                    <br/>

                    <div className="hidden-md hidden-lg" style={{
                      clear: 'both'
                    }}><br/><br/><br/><PlaylistView gameclips={gameclips} playlistItemSelected={this.playlistItemSelected}/></div>
                  </div>
                : <div>
                  <h1 className="headline">Loading...</h1>
                </div>}
            </Col>
          </Row>
        </Grid>
        <div id="playlist-panel" className="hidden-xs hidden-sm">
          <UISideMenu ref="leftPanel" alignment="right" docked={true} open={true}>
            <PlaylistView gameclips={gameclips} playlistItemSelected={this.playlistItemSelected}/>
          </UISideMenu>
        </div>
      </div>
    );
  }

});

export default Gamertag;
