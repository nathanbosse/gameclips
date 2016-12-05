'use strict';

import React, { PropTypes, StyleSheet } from 'react';
import cx from 'classnames';

import Actions from '../actions/Actions';
const FontIcon = require('material-ui/lib/font-icon');
const IconButton = require('material-ui/lib/icon-button');
import Card from 'material-ui/lib/card/card';
const GameClipPlayer = React.createClass({

    propTypes: {
        gameclips: PropTypes.array,
        playlistItemSelected: PropTypes.func
    },
    contextTypes: {
       currentGameClipId: React.PropTypes.string
     },

    getInitialState() {
        return { index: 0,
          gameclips: [],
          loaded: true,}
    },

    componentWillReceiveProps(nextProps) {
        this.setState({
          gameclips: nextProps.gameclips,
          loaded: true
        });
        this.forceUpdate();
    },
    videoLoadedAtIndex(videoIndex) {
      this.setState({
        index: videoIndex
      });
      this.forceUpdate();
    },
    playlistItemSelected(index) {
      this.props.playlistItemSelected(index);
    },
    render(node) {
        const { show } = this.props;

        const { gameclips } = this.state;
          if (this.state.loaded && gameclips) {
          var gameClipsUrls = gameclips.map(function(obj) {
            return obj.ClipUri;
          });
        }
        const index = this.state.index;
        var self = this;
        var itemIndex = 0;
        var itemSelectedCallback = this.playlistItemSelected;
        var viewHTML = this.props.gameclips ? this.props.gameclips.map(function(gameclip) {
          var currentIndex = itemIndex;
          itemIndex++;
          var viewClass = 'playlist-item-view';
          if (self && self.context.currentGameClipId === gameclip.Id) viewClass += ' active';

          // this.context.currentGameClipId === gameclip.Id ? 'playlist-item-view active' : 'playlist-item-view';
            return <div className={viewClass}><Card initiallyExpanded={true}><a onClick={ () => itemSelectedCallback(currentIndex)} className="playlist-view" key={gameclip.Id}><img src={gameclip.Thumbnail}/>
            <div className="item-preview-text">
              <h1 className="sub-headline truncate">{gameclip.TitleName}</h1>
              <h3 className="sub-headline body-link">{gameclip.OwnerGamerTag}</h3>
              <h5 className="caption">{gameclip.tags ? gameclip.tags[0] : ''}</h5>
              <h5 className="caption">{gameclip.UploadTime}</h5>
                      </div>
                    </a></Card></div>
                }) : null;


        // const index = this.state.index;
        return (
          <div className="playlist-wrapper">
            {viewHTML}
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
