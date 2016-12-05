'use strict';

import React, { PropTypes } from 'react';
import PostLink from './PostLink';
import PostInfo from './PostInfo';
import UIVideoPlayer from './UIVideoPlayer';

const Post = React.createClass({

    propTypes: {
        user: PropTypes.object,
        post: PropTypes.object
    },

    render() {
        const { user, post } = this.props;

        if (post.isDeleted) {
            // post doesn't exist
            return (
                <div className="post cf">
                    <div className="post-link">
                        [deleted]
                    </div>
                </div>
            );
        }

        let sources = [
            post.url
        ];
        let props = {
            sources,
            width: 400
        };
        const postURLs = [post.url];

        return (
            <div className="post">
                <PostLink title={ post.title } url={ post.url } />
                  <UIVideoPlayer show={postURLs} />
                <PostInfo post={ post } user={ user } />
            </div>
        );
    }
});

export default Post;
