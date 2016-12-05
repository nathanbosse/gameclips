'use strict';

import Reflux from 'reflux';
import Firebase from 'firebase';
import {
  firebaseUrl
} from '../util/constants';

// used to create email hash for gravatar
import md5 from 'md5';

const baseRef = new Firebase(firebaseUrl);
const commentsRef = baseRef.child('comments');
const postsRef = baseRef.child('posts');
const usersRef = baseRef.child('users');
const gamertagsRef = baseRef.child('gamertags');
const gameClipIdsRef = baseRef.child('gameClipIds');
const collectionsRef = baseRef.child('collections');
const titlesRef = baseRef.child('titles');
import TitleGameClipStore from '../stores/TitleGameClipStore';

import XboxLiveStore from '../stores/XboxLiveStore';
import GlobalsStore from '../stores/GlobalsStore';
import GameClipsStore from '../stores/GameClipsStore';

const Actions = Reflux.createActions([
  // user actions
  'login',
  'logout',
  'register',
  'registerWithLiveOAuth',
  'updateLatestPost',
  // post actions
  'upvotePost',
  'downvotePost',
  'submitPost',
  'deletePost',
  'setSortBy',
  'sortByTitleId',
  // comment actions
  'upvoteComment',
  'downvoteComment',
  'updateCommentCount',
  'addComment',
  'deleteComment',
  // comment form actions
  'commentFormError',
  'clearCommentFormError',
  // xbox live api actions,
  'getXUIDForGamertag',
  'getGameClipsForGamertag',
  'getGameClipsForGameTitle',
  //collections
  'getCollections',
  'updateCollection',
  // application globals
  'showHeader',
  'hideHeader',
  'showLeftNav',
  'hideLeftNav',
  // firebase actions
  'watchPost',
  'watchPosts',
  'watchGameClip',
  'watchCollection',
  'watchCollectionTitled',
  'watchCollections',
  'stopWatchingCollection',
  'stopWatchingCollections',
  'watchProfile',
  'stopWatchingPost',
  'stopWatchingPosts',
  'stopWatchingProfile',
  // view actions
  'trackViewForGameClip',
  'tagGameClip',
  // modal actions
  'showModal',
  'hideModal',
  'modalError',
  'refreshClipUri',
  // global context actions
  'updateCurrentGameClipId',
  'fetchGameClipsObject',
  'stopWatchingGameClipsObject'
]);

/* User Actions
=============================== */

Actions.login.listen((loginData) => {
  baseRef.authWithPassword(loginData, (error) => (
    error ? Actions.modalError(error.code) : Actions.hideModal()
  ));
});

function createUser(gamertag, loginData) {
  let profile = {
    gamertag: gamertag,
    md5hash: md5(loginData.email)
  };

  baseRef.createUser(loginData, (error, userData) => {
    if (error) {
      // email taken, other login errors
      return Actions.modalError(error.code);
    }

    // user successfully created
    // add user profile then log them in
    usersRef.child(userData.uid).set(profile, err => err || Actions.login(loginData));
  });
}

Actions.register.listen((gamertag, loginData) => {
  // check if gamertag is already taken
  usersRef.orderByChild('gamertag').equalTo(gamertag).once('value', (user) => {
    if (user.val()) {
      // gamertag is taken
      Actions.modalError('USERNAME_TAKEN');
    } else {
      // gamertag is available
      createUser(gamertag, loginData);
    }
  });
});

Actions.registerWithLiveOAuth.listen(() => {

  var WINDOWS_LIVE_CLIENT_ID = "0000000048180306";

  // window.location.href="https://login.live.com/oauth20_authorize.srf?client_id="+WINDOWS_LIVE_CLIENT_ID+"&scope=wl.basic&response_type=code&redirect_uri=" + "https://gameclips.herokuapp.com/auth/windows-live/callback";
  window.location.href = "https://gameclips.herokuapp.com/auth/windows-live";


});
/* Post Actions
=============================== */

Actions.submitPost.listen(function(post) {
  let newPostRef = postsRef.push(post, (error) => {
    if (error) {
      return Actions.modalError(error);
    }

    let postId = newPostRef.key();
    // add commentId to user's profile
    usersRef
      .child(`${post.creatorUID}/submitted/${postId}`)
      .set(true, () => Actions.updateLatestPost(postId));
  });
});

Actions.deletePost.listen((post) => {
  postsRef.child(post.id).set({
    isDeleted: true
  }, (error) => {
    if (error) {
      return;
    }

    // remove commentId from user's profile
    usersRef.child(`${post.creatorUID}/submitted/${post.id}`).remove();
  });
});

/*
    I debated for a while here about whether it's okay to trust these
    callbacks to keep things in sync. I looked at Firebase Util (still very
    beta as of June 2015) and Firebase Multi Write but decided that the extra
    dependencies were probably overkill for this project. If you need more
    guarantees that the data will stay in sync, check them out:

    https://github.com/firebase/firebase-util
    https://github.com/katowulf/firebase-multi-write
*/

function updatePostUpvotes(postId, n) {
  postsRef.child(`${postId}/upvotes`).transaction(curr => (curr || 0) + n);
}

/*
    I had this callback backwards at first. It's important to update the
    user's profile first since each time Firebase pushes changes the UI will
    update. Thus, there was a tiny period during which the upvote was
    registered for the post, but not for the user, meaning the user could get
    multiple up/downvotes in before the UI updated for the second time. The
    same is true for up/downvoteComment.
*/

Actions.upvotePost.listen((userId, postId) => {
  // set upvote in user's profile
  usersRef.child(`${userId}/upvoted/${postId}`).set(true, (error) => {
    if (error) {
      return;
    }
    // increment post's upvotes
    updatePostUpvotes(postId, 1);
  });
});

Actions.downvotePost.listen((userId, postId) => {
  // remove upvote from user's profile
  usersRef.child(`${userId}/upvoted/${postId}`).remove((error) => {
    if (error) {
      return;
    }
    // decrement post's upvotes
    updatePostUpvotes(postId, -1);
  });
});


/* Comment Actions
=============================== */

function updateCommentUpvotes(commentId, n) {
  commentsRef.child(`${commentId}/upvotes`).transaction(curr => (curr || 0) + n);
}

Actions.upvoteComment.listen((userId, commentId) => {
  // set upvote in user's profile
  usersRef.child(`${userId}/upvoted/${commentId}`).set(true, (error) => {
    if (error) {
      return;
    }
    // increment comment's upvotes
    updateCommentUpvotes(commentId, 1);
  });
});

Actions.downvoteComment.listen((userId, commentId) => {
  // remove upvote from user's profile
  usersRef.child(`${userId}/upvoted/${commentId}`).remove((error) => {
    if (error) {
      return;
    }
    // decrement comment's upvotes
    updateCommentUpvotes(commentId, -1);
  });
});

function updateCommentCount(postId, n) {
  // updates comment count on post
  postsRef.child(`${postId}/commentCount`).transaction(curr => (curr || 0) + n);
}

Actions.addComment.listen((comment) => {
  let newCommentRef = commentsRef.push(comment, (error) => {
    if (error) {
      return Actions.commentFormError('COMMENT_FAILED');
    }

    Actions.clearCommentFormError();

    updateCommentCount(comment.postId, 1);

    // add commentId to user's profile
    usersRef.child(`${comment.creatorUID}/submitted/${newCommentRef.key()}`).set(true);
  });
});

Actions.deleteComment.listen((comment) => {
  commentsRef.child(comment.id).remove((error) => {
    if (error) {
      return;
    }

    updateCommentCount(comment.postId, -1);

    // remove commentId from user's profile
    usersRef.child(`${comment.creatorUID}/submitted/${comment.id}`).remove();
  });
});

Actions.getXUIDForGamertag.listen((gamertag) => {
  console.log('getXUIDForGamertag(' + gamertag + ') called');
  getXUIDForGamertag(gamertag);
})

function getXUIDForGamertag(gamertag) {

  var request = new XMLHttpRequest();
  var path = "https://xboxapi.com/v2/xuid/" + gamertag;
  request.onreadystatechange = state_change;
  request.open("GET", path, true);
  request.setRequestHeader("X-Auth", "4f13a9345bd5778941a6521d10f85047c6fb2a4e");
  request.setRequestHeader("Content-Type", "application/json");
  request.setRequestHeader("Access-Control-Allow-Origin", "*");

  request.send(null);

  function state_change() {
    if (request.readyState == 4) { // 4 = "loaded"
      if (request.status == 200) { // 200 = OK
        if (request.response.length === 16) {

          gamertagsRef.child(gamertag.toLowerCase()).child('xuid').set(request.response, gamertag_set);
          gamertagsRef.child(gamertag.toLowerCase()).child('display_text').set(gamertag, gamertag_set);
        }
      } else {
        alert("Problem ...");
      }
    }
  }

  function gamertag_set(response) {
    console.log(response);
  }
}
Actions.tagGameClip.listen((gameclipid, tagType, tagValue) => {
  gameClipIdsRef.child(gameclipid).child('Tags').child(tagType).child('value').set(tagValue);
});

Actions.trackViewForGameClip.listen((gameclip) => {
  var newViewRef = gameClipIdsRef.child(gameclip.Id).child('ViewDates').push(new Date().toString());
  gameClipIdsRef.child(gameclip.Id).child('ViewDates').once("value", function(snapshot) {
    gameClipIdsRef.child(gameclip.Id).child('Views').once("value", function(viewsSnapshot) {

      var numberRegex = /\d+/;


      gameClipIdsRef.child(gameclip.Id).child('ViewCount').set(snapshot.numChildren() + parseInt(numberRegex.exec(viewsSnapshot.val()).pop()));
    });
  });
})
Actions.fetchGameClipsObject.listen((startingPath, lookupId) => {
  GameClipsStore.bindTo(startingPath, lookupId);
})
Actions.stopWatchingGameClipsObject.listen(() => {
  GameClipsStore.stopWatchingGameClipsObject();
})

Actions.refreshClipUri.listen((gameclipid) => {
  var request = new XMLHttpRequest();
  var path = window.location.origin + "/v2/gameclip/" + gameclipid;
  request.onreadystatechange = state_change;
  request.open("GET", path, true);
  request.setRequestHeader("Content-Type", "application/json");
  request.send(null);

  function state_change() {
    if (request.readyState == 4) { // 4 = "loaded"
      if (request.status == 200) { // 200 = OK
        gameClipIdsRef.child(gameclipid).child('ClipUri').set(request.response);
      }
    }
  }
})

Actions.getGameClipsForGamertag.listen((gamertag) => {
  console.log('getGameClipsForGamertag(' + gamertag + ') called');
  getGameClipsForGamertag(gamertag);
})

function getGameClipsForGamertag(gamertag) {
  var request = new XMLHttpRequest();
  var path = window.location.origin + "/v10/gamertag/" + gamertag;
  // "https://account.xbox.com/en-us/gameclips/loadByUser?gamerTag="+gamertag+"&maxItems=20"
  // var path="https://xboxapi.com/v2/" + xuid + "game-clips/saved";
  request.onreadystatechange = state_change;
  request.open("GET", path, true);
  // request.setRequestHeader("X-Auth","4f13a9345bd5778941a6521d10f85047c6fb2a4e");
  request.setRequestHeader("Content-Type", "application/json");
  // request.setRequestHeader("Access-Control-Allow-Origin","*");

  request.send(null);

  function state_change() {
    if (request.readyState == 4) { // 4 = "loaded"
      if (request.status == 200) { // 200 = OK
        var gameclipsarray = JSON.parse(request.response)['GameClips'];
        if (gameclipsarray) {
          var numberRegex = /\d+/
          var dateRegex = /\b\d{1,2}[/]?\d{1,2}[/]?\d{4}\b/
          var idRegex = /(?:Id":)"(.*?)"/g
          var sortedClips = request.response.match(idRegex);
          GameClipsStore.pauseUpdates();
          var firebaseClipIds = gameclipsarray.map(function(obj) {


            if (obj.TitleId === 1297287339) {
              obj.TitleName = "Gears of War 3";
            }




            obj.SortIndex = sortedClips.indexOf('Id":"' + obj.Id + '"');
            var rObj = {};
            console.log(obj.Id);
            rObj[obj.Id] = obj;
            gameClipIdsRef.child(obj.Id).update(obj);
            gamertagsRef.child(gamertag.toString()).child('lastFetched').child(obj.Id).set('true');
            gamertagsRef.child(gamertag.toString()).child('gameClipIds').child(obj.Id).set('true');

            gamertagsRef.child(gamertag.toString()).child('titleIds').child(obj.TitleId).set('true');
            titlesRef.child(obj.TitleId).child('titleId').set(obj.TitleId);
            titlesRef.child(obj.TitleId).child('title').set(obj.TitleName);


            return obj.Id;
          });
          gamertagsRef.child(gamertag.toString()).child('lastFetchedDate').set(new Date().getTime());
          GameClipsStore.unpauseUpdates();

        }






      } else {
        alert("Problem ...");
      }
    }
  }

  function gamertag_set(response) {
    console.log(response);
  }
}
Actions.sortByTitleId.listen((titleId) => {
  console.log('sortByTitleId(' + titleId + ') called');
  GameClipsStore.sortByTitleId(titleId);
})
Actions.getGameClipsForGameTitle.listen((titleId) => {
  console.log('getGameClipsForGameTitle(' + titleId + ') called');
  getGameClipsForGameTitle(titleId);
})


function getGameClipsForGameTitle(titleId) {
  var request = new XMLHttpRequest();
  var path = window.location.origin + "/v2/game/" + titleId;
  var numberRegex = /\d+/;
  request.onreadystatechange = state_change;
  request.open("GET", path, true);
  request.setRequestHeader("Content-Type", "application/json");
  request.send(null);
  console.log(path);
  var titleName;
  titlesRef.child(titleId).child('title').once('value', function(snapshot) {
    titleName = snapshot.val();
  })

  function state_change() {
    if (request.readyState == 4) { // 4 = "loaded"
      if (request.status == 200) { // 200 = OK
        var gameclipsarray = JSON.parse(request.response)['GameClips'];
        console.log(request.response);
        var numberRegex = /\d+/
        var dateRegex = /\b\d{1,2}[/]?\d{1,2}[/]?\d{4}\b/
        var idRegex = /(?:Id":)"(.*?)"/g
        var sortedClips = request.response.match(idRegex);
        var firebaseClipIds = gameclipsarray.map(function(obj) {

          var determinedUploadDate = new Date();

          if (dateRegex.test(obj.UploadTime)) {
            determinedUploadDate = new Date(dateRegex.exec(obj.UploadTime));
          } else {
            if (obj.UploadTime.indexOf('less than a minute ago') > -1) {
              //Do nothing, use new Date() for current time
            } else {

              var uploadIntervalText = numberRegex.exec(obj.UploadTime);
              var uploadInterval;
              if (uploadIntervalText) {
                uploadInterval = parseInt(uploadIntervalText.pop());
              } else {
                uploadInterval = 0;
                console.log('error with uploadInterval for UploadTime ' + obj.UploadNow);
              }

              if (obj.UploadTime.indexOf('day') > -1) {
                determinedUploadDate.setDate(determinedUploadDate.getDate() - uploadInterval);
              } else if (obj.UploadTime.indexOf('hour') > -1) {
                determinedUploadDate.setHours(determinedUploadDate.getHours() - uploadInterval);
              } else if (obj.UploadTime.indexOf('minute') > -1) {
                determinedUploadDate.setMinutes(determinedUploadDate.getMinutes() - uploadInterval);
              }
            }

          }
          obj.EstimatedUploadDate = determinedUploadDate.toDateString();
          obj.UploadDate = determinedUploadDate.getTime();
          obj.SortIndex = sortedClips.indexOf('Id":"' + obj.Id + '"');
          obj.TitleId = titleId;
          obj.TitleName = titleName;
          var rObj = {};
          console.log(obj.Id);
          rObj[obj.Id] = obj;
          gameClipIdsRef.child(obj.Id).update(obj);
          gameClipIdsRef.child(obj.Id).child('ViewCount').set(parseInt(numberRegex.exec(obj.Views).pop()));

          titlesRef.child(titleId.toString()).child('lastFetched').child(obj.Id).set('true');
          return obj.Id;
        });
        titlesRef.child(titleId.toString()).child('lastFetchedDate').set(new Date().toString());
        var firebaseGameClips = [];
        titlesRef.child(titleId.toString()).child('lastFetched').once('value', function(snapshot) {
          snapshot.forEach(function(gameclipid) {
            var key = gameclipid.key();
            baseRef.child('gameClipIds').child(key)
              .once('value', function(gameclip) {
                firebaseGameClips.push(gameclip.val());

                if (firebaseGameClips.length == firebaseClipIds.length) {
                  TitleGameClipStore.setGameClips(firebaseGameClips);

                }
              });
          });
        });

      } else {
        alert("Problem ...");
      }
    }
  }

  function gamertag_set(response) {
    console.log(response);
  }
}
Actions.getCollections.listen(() => {
  collectionsRef.once('value', function(snap) {

  });
})
Actions.updateCurrentGameClipId.listen((gameclipid) => {
  GlobalsStore.updateCurrentGameClipId(gameclipid);
})

Actions.showHeader.listen(() => {
  GlobalsStore.showHeader();
})
Actions.hideHeader.listen(() => {
  GlobalsStore.hideHeader();
})
Actions.showLeftNav.listen(() => {
  GlobalsStore.showLeftNav();
})
Actions.hideLeftNav.listen(() => {
  GlobalsStore.hideLeftNav();
})

export default Actions;
