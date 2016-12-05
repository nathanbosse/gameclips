'use strict';

import Reflux from 'reflux';
import Firebase from 'firebase';
import Actions from '../actions/Actions';
import {
  firebaseUrl
} from '../util/constants';

let baseRef = new Firebase(firebaseUrl);
let tagsRef = baseRef.child('tags');

let tagData = {
  tagType: null,
};

const SingleGameClipStore = Reflux.createStore({

  listenables: Actions,

  watchTags(gameclipid) {
    gameClipIdsRef
      .child(gameclipid)
      .on('value', this.updateGameClip);
  },
  stopWatchingCollection() {
    collectionsRef.off();
  },
  updateGameClip(gameClipDataObj) {
    var self = this;
    let gameclip = gameClipDataObj.val();
    if (!gameclip) {
      // gameclip doesn't exist
      gameClipData.gameclip = null;
    } else {
      gameClipData.gameclipid = gameClipDataObj.key();
      gameClipData.gameclip = gameclip;
    }
    this.trigger(gameClipData);
  },
  getDefaultData() {
    return gameClipData;
  }

});

export default SingleGameClipStore;
