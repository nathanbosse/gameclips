'use strict';

import Reflux from 'reflux';
import Firebase from 'firebase';
import Actions from '../actions/Actions';
import { firebaseUrl } from '../util/constants';

let baseRef = new Firebase(firebaseUrl);
let gameClipIdsRef = baseRef.child('gameClipIds');

let gameClipData = {
    gameclip: null,
};

const SingleGameClipStore = Reflux.createStore({

    listenables: Actions,

    watchGameClip(gameclipid) {
      // data.currentPage = pageNum || 1;
      gameClipIdsRef
          .child(gameclipid)
          // +1 extra post to determine whether another page exists
          // .limitToLast((data.currentPage * postsPerPage) + 1)
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
