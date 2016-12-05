'use strict';

import React, {PropTypes} from 'react';
import Reflux from 'reflux';
import {History} from 'react-router';

import Actions from '../actions/Actions';

import ProfileStore from '../stores/ProfileStore';
import UserStore from '../stores/UserStore';

import Spinner from '../components/Spinner';
import Post from '../components/Post';
import Comment from '../components/Comment';
import GameClipPlayer from '../components/GameClipPlayer';
import PlaylistView from '../components/PlaylistView';
import UISideMenu from '../components/UISideMenu';

import {Grid, Col, Row} from 'react-bootstrap';
const FontIcon = require('material-ui/lib/font-icon');
import SingleGameClipStore from '../stores/SingleGameClipStore';

const Gamertag = React.createClass({

  propTypes: {
    params: PropTypes.object
  },

  mixins: [
    History,
    Reflux.listenTo(SingleGameClipStore, 'updateGameClip')
  ],

  getInitialState() {
    return {loaded: false};
  },

  componentDidMount() {
    Actions.showLeftNav();
    Actions.hideHeader();
    let gameclipid = this.props.params.gameclipid;
    // Actions.refreshClipUri(gameclipid);
    Actions.watchGameClip(gameclipid);
  },

  componentWillReceiveProps(nextProps) {
    let oldgameclipid = this.props.params.gameclipid;
    let newgameclipid = nextProps.params.gameclipid;

    if (oldgameclipid !== newgameclipid) {
      // Actions.getGameClipsForGamertag(newgameclipid);
      this.setState({loaded: false});
    }
  },

  componentWillUnmount() {},

  updateGameClip(gameClipData) {

    this.setState({
      gameclips: [gameClipData.gameclip],
      loaded: true
    });
    this.forceUpdate();
    this.refs.gameClipPlayer.loadVideoAtIndex(0);

  },
  logout(e) {},
  playlistItemSelected(selectedIndex) {
    this.refs.gameClipPlayer.loadVideoAtIndex(selectedIndex);
  },
  render() {
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

    return (
      <div id="gamertag">
        <div style={{
          height: '64px'
        }}></div>
        <br></br>
        <Grid fluid={true}>
          <Row>
            <Col xs={12} md={10} mdOffset={1}>
              {this.state.loaded
                ? <div>
                    <GameClipPlayer gameclips={gameclips} ref="gameClipPlayer" showSingleClipLinks={false}/>

                    <div className="hidden-md hidden-lg"><br/><br/><br/><PlaylistView gameclips={gameclips} playlistItemSelected={this.playlistItemSelected}/></div>
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
