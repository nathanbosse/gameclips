'use strict';

import React, {PropTypes} from 'react';
import Reflux from 'reflux';
import Actions from '../actions/Actions';
import {History} from 'react-router';
import ReactFireMixin from 'reactfire';

import {firebaseUrl} from '../util/constants';

import CollectionsStore from '../stores/CollectionsStore';
import UserStore from '../stores/UserStore';

import Spinner from '../components/Spinner';
import CollectionPreview from '../components/CollectionPreview';
import {Grid, Col, Row} from 'react-bootstrap';

import Post from '../components/Post';
import Link from 'react-router/lib/Link';
const baseRef = new Firebase(firebaseUrl);
const gamertagsRef = baseRef.child('gamertags');

const Home = React.createClass({

  propTypes: {
    params: PropTypes.object
  },

  mixins: [
    History,
    Reflux.listenTo(CollectionsStore, 'onStoreUpdate'),
    Reflux.connect(UserStore, 'user'),
    ReactFireMixin

  ],

  getInitialState() {
    const collectionsData = CollectionsStore.getDefaultData();

    return {
      user: UserStore.getDefaultData(),
      loading: true,
      collections: collectionsData.collections,
      sortOptions: collectionsData.sortOptions,
      nextPage: collectionsData.nextPage,
      currentPage: collectionsData.currentPage
    };
  },
  componentWillMount() {
    this.bindAsObject(gamertagsRef.orderByChild('lastFetchedDate').limitToFirst(5), "lastFetchedGamertags");
  },
  componentDidMount() {
    Actions.showHeader();
    Actions.hideLeftNav();

    const {pageNum} = this.props.params;

    Actions.watchCollections(pageNum);
  },

  componentWillReceiveProps(nextProps) {
    const {pageNum} = nextProps.params;

    Actions.stopWatchingCollections();
    Actions.watchCollections(pageNum);
  },

  componentWillUnmount() {
    Actions.stopWatchingCollections();
  },

  onStoreUpdate(collectionsData) {
    this.setState({
      loading: false,
      collections: collectionsData.collections,
      sortOptions: collectionsData.sortOptions,
      nextPage: collectionsData.nextPage,
      currentPage: + collectionsData.currentPage
    });
  },

  updateSortBy(e) {
    e.preventDefault();
    const {sortOptions} = this.state;
    const currentPage = this.state.currentPage || 1;
    const sortByValue = e.target.value;

    // optimistically update selected option
    sortOptions.currentValue = sortByValue;

    this.setState({loading: true, sortOptions: sortOptions});

    Actions.setSortBy(sortByValue);

    Actions.stopWatchingCollections();
    Actions.watchCollections(currentPage);
  },

  render() {
    const {
      loading,
      nextPage,
      user,
      collections,
      sortOptions,
      lastFetchedGamertags
    } = this.state;
    const currentPage = this.state.currentPage || 1;

    // possible sort values
    const sortValues = Object.keys(sortOptions.values);

    const options = sortValues.map((optionText, i) => (
      <option value={sortOptions[i]} key={i}>{optionText}</option>
    ));

    const collectionsEls = collections.length
      ? collections.map((collection) => (
        <Col xs={12} md={4}>
          <Link to={'/collection/' + collection.collectionId}><CollectionPreview collection={collection} user={user} key={collection.id}/></Link>
        </Col>
      ))
      : 'There are no posts yet!';
    var gamertagKeys = this.state.lastFetchedGamertags
      ? Object.keys(this.state.lastFetchedGamertags).filter(function(key) {
        return key !== '.key'
      })
      : null;
    const gamertagElements = this.state.lastFetchedGamertags && gamertagKeys
      ? gamertagKeys.map((gamertagKey) => (
        <Col xs={12} md={4}>{gamertagKey}</Col>
      ))
      : 'Loading gamertags...';
    return (
      <Grid>
        <div className="content full-width">
          <label htmlFor="sortby-select" className="sortby-label">Sort by
          </label>
          <div className="sortby">
            <select id="sortby-select" className="sortby-select" onChange={this.updateSortBy} value={sortOptions.currentValue} ref="sortBy">
              {options}
            </select>
          </div>
          <hr/>
          <Row>
            <div className="collections">
              {loading
                ? <Spinner/>
                : collectionsEls}
            </div>
          </Row>
          <Row>
            <div className="gamertags">
              {false
                ? gamertagElements
                : null}
            </div>
          </Row>
          <hr/>
          <nav className="pagination">
            {nextPage
              ? (
                <Link to={`/posts/${currentPage + 1}`} className="next-page">
                  Load More Posts
                </Link>
              )
              : 'No More Posts'
}
          </nav>
        </div>
      </Grid>
    );
  }

});

export default Home;
