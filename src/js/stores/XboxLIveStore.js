'use strict';

import Reflux from 'reflux';
import Firebase from 'firebase';
import Actions from '../actions/Actions';
import { firebaseUrl } from '../util/constants';

let baseRef = new Firebase(firebaseUrl);
let postsRef = baseRef.child('posts');
const gamertagsRef = baseRef.child('gamertags');


const sortValues = {
    // values mapped to firebase locations at baseRef/posts
    saved: true,
    titleId: '',
    comments: 'commentCount'
};

let data = {
    gameclips: [],
    gamertag: 1,

    sortValues: {
        saved: true,
        titleIdSortValue: '',
    }
};
var cleanGameClipsCopy;
const XboxLiveStore = Reflux.createStore({

    listenables: Actions,

    sortByTitleId(titleId) {
        data.sortValues.titleIdSortValue = titleId;
        this.setGameClips(cleanGameClipsCopy);

    },
    setSearchGamertag(gamertag) {
      data.gamertag = gamertag;
    },
    setSearchXUID(xuid) {
      data.xuid = xuid;
    },
    setGameClips(gameclips) {
      var sortPasses = 0;
      cleanGameClipsCopy = gameclips;
      if (data.sortValues.titleIdSortValue) {
        gameclips = gameclips.filter(function (value) {
          return value.TitleId === data.sortValues.titleIdSortValue;
        })
      }
      gameclips.sort(function (a, b) {
        var newer = b.UploadDate - a.UploadDate;
        sortPasses++;
        return newer;
      });
      console.log(sortPasses+' sort passes to sort '+gameclips.length+' game clips');


      data.gameclips = gameclips;
      this.trigger(data);
    },
    getDefaultData() {
        return data;
    }

});

export default XboxLiveStore;
