/*
 This file is a part of libertysoil.org website
 Copyright (C) 2016  Loki Education (Social Enterprise)

 This program is free software: you can redistribute it and/or modify
 it under the terms of the GNU Affero General Public License as published by
 the Free Software Foundation, either version 3 of the License, or
 (at your option) any later version.

 This program is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU Affero General Public License for more details.

 You should have received a copy of the GNU Affero General Public License
 along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import Helmet from 'react-helmet';

import {
  mapOf as mapOfPropType,
  url as urlPropType,
  uuid4 as uuid4PropType
} from '../prop-types/common';
import {
  ArrayOfPostsId as ArrayOfPostsIdPropType,
  MapOfPosts as MapOfPostsPropType
} from '../prop-types/posts';
import { CommentsByCategory as CommentsByCategoryPropType } from '../prop-types/comments';
import {
  ArrayOfUsersId as ArrayOfUsersIdPropType,
  MapOfUsers as MapOfUsersPropType,
  CurrentUser as CurrentUserPropType
} from '../prop-types/users';

import NotFound from './not-found';
import BaseUserPage from './base/user';
import River from '../components/river_of_posts';

import { API_HOST } from '../config';
import ApiClient from '../api/client';
import { addUser } from '../actions/users';
import { setUserPosts } from '../actions/posts';
import { ActionsTrigger } from '../triggers';
import { defaultSelector } from '../selectors';

class UserPage extends React.Component {
  static displayName = 'UserPage';

  static propTypes = {
    comments: CommentsByCategoryPropType.isRequired,
    current_user: CurrentUserPropType,
    followers: mapOfPropType(uuid4PropType, ArrayOfUsersIdPropType).isRequired,
    following: mapOfPropType(uuid4PropType, ArrayOfUsersIdPropType).isRequired,
    i_am_following: ArrayOfUsersIdPropType,
    is_logged_in: PropTypes.bool.isRequired,
    location: PropTypes.shape({}).isRequired,
    params: PropTypes.shape({
      username: urlPropType.isRequired
    }).isRequired,
    posts: MapOfPostsPropType.isRequired,
    user_posts: mapOfPropType(uuid4PropType, ArrayOfPostsIdPropType).isRequired,
    users: MapOfUsersPropType.isRequired
  };

  static childContextTypes = {
    routeLocation: PropTypes.shape({}).isRequired // not jush 'location' to prevent misleading warnings
  };

  static async fetchData(router, store, client) {
    const userInfo = await client.userInfo(router.params.username);
    const userPosts = client.userPosts(router.params.username);

    store.dispatch(addUser(userInfo));
    store.dispatch(setUserPosts(userInfo.id, await userPosts));
  }

  getChildContext() {
    const { location } = this.props;

    return { routeLocation: location };
  }

  render() {
    const {
      comments,
      current_user,
      followers,
      following,
      i_am_following,
      is_logged_in,
      params,
      posts,
      ui,
      user_posts,
      users
    } = this.props;

    const page_user = _.find(users, { username: params.username });
    if (_.isUndefined(page_user)) {
      return null;  // not loaded yet
    }

    if (false === page_user) {
      return <NotFound />;
    }

    let userPostsRiver = user_posts[page_user.id];
    if (!userPostsRiver) {
      userPostsRiver = [];
    }

    const client = new ApiClient(API_HOST);
    const triggers = new ActionsTrigger(client, this.props.dispatch);

    return (
      <BaseUserPage
        current_user={current_user}
        followers={followers}
        following={following}
        i_am_following={i_am_following}
        is_logged_in={is_logged_in}
        page_user={page_user}
        triggers={triggers}
      >
        <Helmet title={`Posts of ${page_user.fullName} on `} />
        <River
          comments={comments}
          current_user={current_user}
          posts={posts}
          river={userPostsRiver}
          triggers={triggers}
          ui={ui}
          users={users}
        />
      </BaseUserPage>
    );
  }
}

export default connect(defaultSelector)(UserPage);
