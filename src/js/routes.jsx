'use strict';

import React from 'react';
import { Router, Route, Redirect } from 'react-router';

import App from './App';
import Home from './views/Home';
import Posts from './views/Posts';
import Browse from './views/Browse';
import SinglePost from './views/Single';
import SingleGameClip from './views/SingleGameClip';
import Profile from './views/Profile';
import Collection from './views/Collection';
import Game from './views/Game';
import Gamertag from './views/Gamertag';
import UhOh from './views/404';
import createBrowserHistory from 'history/lib/createBrowserHistory'

export default (
    <Router history={createBrowserHistory()}>
        <Route component={ App }>
            <Route name="home" path="/" component={ Home } ignoreScrollBehavior />
            <Route name="posts" path="/posts/:pageNum" component={ Posts } ignoreScrollBehavior />
            <Route name="browse" path="/browse/:pageNum" component={ Browse } ignoreScrollBehavior/>
            <Route name="game" path="/game/:titleId" component={ Game } ignoreScrollBehavior/>
            <Route name="collection" path="/collection/:collectionId" component={ Collection } ignoreScrollBehavior/>
            <Route name="gameclip" path="/gameclip/:gameclipid" component={ SingleGameClip }/>
            <Route name="post" path="/post/:postId" component={ SinglePost } />
            <Route name="profile" path="/user/:username" component={ Profile } />
            <Route name="gamertag" path="/gamertag/:gamertag" component={ Gamertag } />
            <Route name="account" path="/account" component={ Profile } />
            <Route name="404" path="/404" component={ UhOh } />
            {/* Redirects */}
            {/* <Redirect from="*" to="/404" />*/}
        </Route>
    </Router>
);
