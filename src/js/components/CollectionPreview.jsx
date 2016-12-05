'use strict';

import React, {PropTypes, StyleSheet} from 'react';
import cx from 'classnames';
import ReactFireMixin from 'reactfire';
import {firebaseUrl} from '../util/constants';

import Actions from '../actions/Actions';
const FontIcon = require('material-ui/lib/font-icon');
const IconButton = require('material-ui/lib/icon-button');
import Card from 'material-ui/lib/card/card';

import AutonextListener from './AutonextListener';

import UIVideoPlayer from './UIVideoPlayer';
const baseRef = new Firebase(firebaseUrl);
const gameClipIdsRef = baseRef.child('gameClipIds');

const CollectionPreview = React.createClass({
  mixins: [ReactFireMixin],

  propTypes: {
    collection: PropTypes.object
  },

  getInitialState() {
    return {previewImage: '', title: '', upvotes: ''}
  },
  componentWillMount() {
    if (this.props.collection.gameclips.length && this.props.collection.gameclips[0].Id) {
      this.bindAsObject(gameClipIdsRef.child(this.props.collection.gameclips[0].Id), "previewGameClip");

    }
  },
  componentWillReceiveProps(nextProps) {
    if ((!this.props.collection.gameclips.length && nextProps.collection.gameclips.length) || !this.state.previewGameClip) {
      this.bindAsObject(gameClipIdsRef.child(this.props.collection.gameclips[0].Id), "previewGameClip");
    } else if (nextProps.collection.gameclips.length !== this.props.collection.gameclips.length || !this.state.previewGameClip) {
      this.unbind('previewGameClip');
      this.bindAsObject(gameClipIdsRef.child(this.props.collection.gameclips[0].Id), "previewGameClip");
    }
    this.setState({previewImage: nextProps.previewImage, title: nextProps.title, upvotes: nextProps.upvotes});
    this.forceUpdate();
  },
  render(node) {
    const {collection} = this.props;
    var previewImage = this.state.previewGameClip
      ? this.state.previewGameClip.Thumbnail
      : '';
    return (
      <Card>
        <img src={previewImage}></img>
        <div className='collection-preview-text'>
          <h5 className='title'>{collection.title}</h5>
          <h5 className='sub-headline'>{collection.upvoteCount}
            upvotes</h5>
        </div>
      </Card>
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

export default CollectionPreview;
