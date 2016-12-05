'use strict';

import Reflux from 'reflux';
import Firebase from 'firebase';
import Actions from '../actions/Actions';
import {
  firebaseUrl
} from '../util/constants';

let baseRef = new Firebase(firebaseUrl);
let collectionsRef = baseRef.child('collections');
let gameClipIdsRef = baseRef.child('gameClipIds');

let collectionData = {
  collectionId: null,
  collection: null,
};

const SingleCollectionStore = Reflux.createStore({

  listenables: Actions,

  watchCollection(collectionId) {
    collectionsRef
      .child(collectionId)
      .on('value', this.updateCollection);
  },
  watchCollectionTitled(collectionTitle) {
    collectionsRef
      .orderByChild('Title')
      .equalTo(decodeURIComponent(collectionTitle))
      .on('value', this.updateCollection);
  },
  stopWatchingCollection() {
    collectionsRef.off();
  },
  updateCollection(collectionDataObj) {
    var self = this;
    let collection = collectionDataObj.val();
    if (!collection) {
      // collection doesn't exist
      collectionData.collection = null;
    } else {
      collectionData.collectionId = collectionDataObj.key();
      collectionData.collection = collection;
      collectionData.collection.gameclips = [];
      collectionDataObj.child('gameclipids').forEach(function(gameclipid) {
        var key = gameclipid.key();
        baseRef.child('gameClipIds').child(key)
          .once('value', function(gameclip) {
            collectionData.collection.gameclips.push(gameclip.val());
            // console.log( idx_entry.name() + ' has a new message! ' );
            if (collectionData.collection.gameclips.length == Object.keys(collectionData.collection.gameclipids).length) {
              self.trigger(collectionData);
            }
          });
      });
    }
  },
  getDefaultData() {
    return collectionData;
  }

});

export default SingleCollectionStore;
