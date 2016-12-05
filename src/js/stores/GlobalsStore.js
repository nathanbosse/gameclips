'use strict';

import Reflux from 'reflux';
import Firebase from 'firebase';
import Actions from '../actions/Actions';

var data = {
  showHeader: false,
  showLeftNav: false,
  currentGameClip: ''
};

const GlobalsStore = Reflux.createStore({

  listenables: Actions,
  showHeader() {
    data.showHeader = true;
    this.trigger(data);
    this.globalsUpdated();
  },
  hideHeader() {
    data.showHeader = false;
    this.trigger(data);
    this.globalsUpdated();
  },
  showLeftNav() {
    data.showLeftNav = true;
    this.trigger(data);
    this.globalsUpdated();
  },
  hideLeftNav() {
    data.showLeftNav = false;
    this.trigger(data);
    this.globalsUpdated();
  },
  updateCurrentGameClipId(gameclipid) {
    data.currentGameClip = gameclipid;
    this.trigger(data);
  },
  globalsUpdated() {
    this.trigger(data);
  },
  getDefaultData() {
    return data;
  }

});

export default GlobalsStore;
