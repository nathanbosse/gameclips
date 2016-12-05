'use strict';

import React, { PropTypes } from 'react';
import Reflux from 'reflux';
import Actions from '../actions/Actions';
import { History } from 'react-router';

import PostsStore from '../stores/PostsStore';
import UserStore from '../stores/UserStore';
import CollectionsStore from '../stores/CollectionsStore';

import CollectionPreview from '../components/CollectionPreview';
import Spinner from '../components/Spinner';
import Post from '../components/Post';
import Link from 'react-router/lib/Link';

const Browse = React.createClass({

    propTypes: {
        params: PropTypes.object
    },

    mixins: [
        History,
        Reflux.listenTo(CollectionsStore, 'onStoreUpdate'),
        Reflux.connect(UserStore, 'user')
    ],

    getInitialState() {
        const collectionData = CollectionsStore.getDefaultData();

        return {
            user: UserStore.getDefaultData(),
            loading: true,
            collections: collectionData.collections,
            sortOptions: collectionData.sortOptions,
            nextPage: collectionData.nextPage,
            currentPage: collectionData.currentPage
        };
    },

    componentDidMount() {
        var pageNum = this.props.params.pageNum;

        if (isNaN(pageNum) || pageNum < 1) {
            // this.history.pushState(null, '/404');
            // return;
            pageNum = 1;
        }

        Actions.watchCollections(pageNum);
    },

    componentWillReceiveProps(nextProps) {
      var pageNum = nextProps.params.pageNum;

        if (isNaN(pageNum) || pageNum < 1) {
            // this.history.pushState(null, '/404');
            // return;
            pageNum = 1;
        } else {

        Actions.stopWatchingCollections();
        Actions.watchCollections(pageNum);
      }
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
            currentPage: +collectionsData.currentPage
        });
    },

    updateSortBy(e) {
        e.preventDefault();
        const { sortOptions } = this.state;
        const currentPage = this.state.currentPage || 1;
        const sortByValue = e.target.value;

        // optimistically update selected option
        sortOptions.currentValue = sortByValue;

        this.setState({
            loading: true,
            sortOptions: sortOptions
        });

        Actions.setSortBy(sortByValue);

        // if (currentPage !== 1) {
        //     // this.history.pushState(null, '/posts/1');
        // } else {
        //     Actions.stopWatchingPosts();
        //     Actions.watchPosts(currentPage);
        // }
    },

    render() {
        const { loading, nextPage, user, collections, sortOptions } = this.state;
        const currentPage = this.state.currentPage || 1;

        // possible sort values (defined in PostsStore)
        const sortValues = Object.keys(sortOptions.values);

        const options = sortValues.map((optionText, i) => (
            <option value={ sortOptions[i] } key={ i }>{ optionText }</option>
        ));

        const collectionsEls = collections.length
            ? collections.map((collection) => (
                <CollectionPreview collection={ collection } />)
            )
            : 'There are no posts yet!';

        return (
            <div className="content full-width">
                <label htmlFor="sortby-select" className="sortby-label">Sort by </label>
                <div className="sortby">
                    <select
                        id="sortby-select"
                        className="sortby-select"
                        onChange={ this.updateSortBy }
                        value={ sortOptions.currentValue }
                        ref="sortBy"
                    >
                        { options }
                    </select>
                </div>
                <hr />
                <div className="posts">
                    { loading ? <Spinner /> : collectionEls }
                </div>
                <hr />
                <nav className="pagination">
                    {
                        nextPage ? (
                            <Link to={ `/browse/${currentPage + 1}` } className="next-page">
                                Load More Posts
                            </Link>
                          ) : 'No More Posts'
                    }
                </nav>
            </div>
        );
    }

});

export default Browse;
