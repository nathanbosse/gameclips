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
const gameClipIdsRef = baseRef.child('gameClipIds');


const sortValues = {
  // values mapped to firebase locations at baseRef/posts
  saved: true,
  titleId: '',
  comments: 'commentCount'
};

let data = {
  gameclips: [],
  gameClipIds: [],
  parent: {},
  expectedCount: 0,
  startingPath: '',
  lookupId: '',
  loaded: false,
  paused: false,


  sortValues: {
    saved: true,
    titleIdSortValue: '',
  }
};
var cleanGameClipsCopy;
var firebaseRefs = [];
var firebaseParentRef;
var firebaseParentFunction;
const GameClipsStore = Reflux.createStore({
  listenables: Actions,
  bindTo(startingPath, lookupId) {
    if (data.startingPath !== startingPath || data.lookupId !== lookupId) {
      data.gameclips = [];
      data.gameClipIds = [];
      data.startingPath = startingPath;
      data.lookupId = lookupId;
      data.expectedCount = 0;
    }

    var self = this;
    var expectedCount = 0;
    firebaseParentFunction = baseRef.child(startingPath + '/' + lookupId).on('value', function(snap) {
      firebaseParentRef = snap.ref();
      if (snap.val()['gameClipIds']) {
        data.parent = snap.val();
        var keys = Object.keys(snap.val()['gameClipIds']);
        if (data.expectedCount !== keys.length) {
          data.expectedCount = keys.length;
          snap.child('gameClipIds').forEach(function(key) {
            baseRef.child('gameClipIds' + '/' + key.key()).once('value', self.gameClipValueChanged);
          })
        }
      }
    })
  },
  gameClipValueChanged(snap) {
    var self = this;
    if (data.gameClipIds.indexOf(snap.key()) == -1) {
      data.gameClipIds.push(snap.key());
    }
    data.gameclips[data.gameClipIds.indexOf(snap.key())] = snap.val();
    if (!snap.val().UploadDate) {
      var uploadDate = self.determineUpdateDate(snap.val());
      gameClipIdsRef.child(snap.key()).child('UploadDate').set(uploadDate.getTime());
      gameClipIdsRef.child(snap.key()).child('EstimatedUploadDate').set(uploadDate.toDateString());
      data.gameclips[data.gameClipIds.indexOf(snap.key())].EstimatedUploadDate = uploadDate.toDateString();
      data.gameclips[data.gameClipIds.indexOf(snap.key())].UploadDate = uploadDate.getTime();
    }

    if (data.loaded == false) {

      if (data.gameclips.length === data.expectedCount) {
        data.loaded = true
        self.sortGameClips(data.gameclips);
      }
    } else if (data.paused == false) {
      self.trigger(data);
    }
  },
  pauseUpdates() {
    this.stopWatchingGameClipsObject();
  },
  stopWatchingGameClipsObject() {
    var self = this;
    data.loaded = false;

    firebaseParentRef ? firebaseParentRef.off('value', firebaseParentFunction) : null;
  },
  unpauseUpdates() {
    data.loaded = false;
    data.gameclips = [];
    data.gameClipIds = [];
    this.bindTo(data.startingPath, data.lookupId)
  },
  gameClipsUpdated() {
    this.trigger(data);

  },
  sortByTitleId(titleId) {
    data.sortValues.titleIdSortValue = titleId;
    this.setGameClips(cleanGameClipsCopy);

  },
  determineUpdateDate(gameclip) {
    var determinedUploadDate = new Date();
    var numberRegex = /\d+/
    var dateRegex = /\b\d{1,2}[/]?\d{1,2}[/]?\d{4}\b/
    var idRegex = /(?:Id":)"(.*?)"/g
    if (dateRegex.test(gameclip.UploadTime)) {
      determinedUploadDate = new Date(dateRegex.exec(gameclip.UploadTime));
    } else {
      if (gameclip.UploadTime.indexOf('less than a minute ago') > -1) {
        //Do nothing, use new Date() for current time
      } else {

        var uploadIntervalText = numberRegex.exec(gameclip.UploadTime);
        var uploadInterval;
        if (uploadIntervalText) {
          uploadInterval = parseInt(uploadIntervalText.pop());
        } else {
          uploadInterval = 0;
          console.log('error with uploadInterval for UploadTime ' + gameclip.UploadNow);
        }

        if (gameclip.UploadTime.indexOf('day') > -1) {
          determinedUploadDate.setDate(determinedUploadDate.getDate() - uploadInterval);
        } else if (gameclip.UploadTime.indexOf('hour') > -1) {
          determinedUploadDate.setHours(determinedUploadDate.getHours() - uploadInterval);
        } else if (gameclip.UploadTime.indexOf('minute') > -1) {
          determinedUploadDate.setMinutes(determinedUploadDate.getMinutes() - uploadInterval);
        }
      }

    }
    return determinedUploadDate;
  },
  setSearchGamertag(gamertag) {
    data.gamertag = gamertag;
  },
  setSearchXUID(xuid) {
    data.xuid = xuid;
  },
  sortGameClips(gameclips) {
    var sortPasses = 0;
    cleanGameClipsCopy = gameclips;
    if (data.sortValues.titleIdSortValue) {
      gameclips = gameclips.filter(function(value) {
        return value.TitleId === data.sortValues.titleIdSortValue;
      })
    }
    gameclips.sort(function(a, b) {
      var newer = b.UploadDate - a.UploadDate;
      sortPasses++;
      return newer;
    });
    console.log(sortPasses + ' sort passes to sort ' + gameclips.length + ' game clips');


    data.gameclips = gameclips;
    this.trigger(data);
  },
  getDefaultData() {
    return data;
  }

});

export default GameClipsStore;
