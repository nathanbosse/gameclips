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

let postsPerPage = 10;

const sortValues = {
  // values mapped to firebase locations at baseRef/posts
  upvotes: 'upvotes',
  newest: 'time',
  comments: 'commentCount'
};

let data = {
  collections: [],
  currentPage: 1,
  nextPage: true,
  sortOptions: {
    currentValue: 'upvotes',
    values: sortValues
  },
};

const CollectionsStore = Reflux.createStore({

  listenables: Actions,
  setSortBy(value) {
    data.sortOptions.currentValue = value;
  },
  watchCollections(pageNum) {
    collectionsRef
      .orderByChild(sortValues[data.sortOptions.currentValue])
      .on('value', this.updateCollections);
  },
  stopWatchingCollections() {
    collectionsRef.off();
  },
  updateCollections(collectionDataObj) {
    let endAt = data.currentPage * postsPerPage;

    data.collections = [];
    let newCollections = [];
    var index = 0;
    var self = this;
    var joined = collectionDataObj.forEach(collectionData => {
      var collection = collectionData.val();
      collection.gameclips = [];
      collection.collectionId = collectionData.key();
      collectionData.child('gameclipids').forEach(function(gameclipid) {
        var key = gameclipid.key();
        baseRef.child('gameClipIds').child(key)
          .once('value', function(gameclip) {
            data.collections[this.index] ? data.collections[this.index].gameclips.push(gameclip.val()) : null;
            Actions.refreshClipUri(key);
            if (data.collections[this.index] && data.collections[this.index].gameclips.length == Object.keys(collection.gameclips).length) {
              self.trigger(data);
            }
          }, {
            index: index
          });
      });
      data.collections[index] = collection;
      this.trigger(data);

      index++;
    });

  },
  getDefaultData() {
    return data;
  }

});

export default CollectionsStore;
