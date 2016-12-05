'use strict';

import Reflux from 'reflux';
import Firebase from 'firebase';
import Actions from '../actions/Actions';
import {
  firebaseUrl
} from '../util/constants';

let baseRef = new Firebase(firebaseUrl);
let postsRef = baseRef.child('posts');
const gamertagsRef = baseRef.child('gamertags');


const sortValues = {
  // values mapped to firebase locations at baseRef/posts
  saved: true,
  game: 'call of duty: black ops 3',
  comments: 'commentCount'
};

let data = {
  gameclips: [],
  sortValues: {
    saved: true,
    game: 'call of duty: black ops 3',
  }
};

const TitleGameClipStore = Reflux.createStore({

  listenables: Actions,
  setGameClips(gameclips) {
    data.gameclips = gameclips;
    this.trigger(data);
  },
  getDefaultData() {
    return data;
  }

});

export default TitleGameClipStore;
