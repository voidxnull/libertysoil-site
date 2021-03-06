/*
 This file is a part of libertysoil.org website
 Copyright (C) 2015  Loki Education (Social Enterprise)

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
import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';

import BaseInductionPage from './base/induction';
import User from '../components/user';
import FollowButton from '../components/follow-button';
import Footer from '../components/footer';
import Header from '../components/header';
import ApiClient from '../api/client';
import { API_HOST } from '../config';
import { addUser } from '../actions';
import { ActionsTrigger } from '../triggers'
import { defaultSelector } from '../selectors';


let InductionDone = () => (
  <div className="area">
    <div className="area__body">
      <div className="message">
        <div className="message__body">
          You are done! You can proceed to <Link className="link" to="/">your feed</Link>.
        </div>
      </div>
    </div>
  </div>
);

export default class UserGrid extends React.Component {
  static displayName = 'UserGrid'

  render () {
    const {
      users,
      current_user,
      i_am_following,
      triggers
    } = this.props;

    if (!users) {
      return null;
    }

    return (
      <div className="layout__grids layout__grids-space layout__grid-responsive">
        {users.map((user) => (
          <div className="layout__grids_item layout__grids_item-space layout__grid_item-50" key={user.id}>
            <div className="layout__row layout__row-small">
              <User
                user={user}
                avatarSize="32"
              />
            </div>

            <div className="layout__row layout__row-small">
              <FollowButton
                active_user={current_user}
                following={i_am_following}
                triggers={triggers}
                user={user}
              />
            </div>
          </div>
        ))}
      </div>
    );
  }
}

class InductionPage extends React.Component {
  static displayName = 'InductionPage'

  static async fetchData(params, store, client) {
    const state = store.getState();

    let currentUserId = state.getIn(['current_user', 'id']);
    let userInfo = await client.userInfo(state.getIn(['users', currentUserId, 'username']));
    store.dispatch(addUser(userInfo));

    let trigger = new ActionsTrigger(client, store.dispatch);
    await trigger.loadInitialSuggestions();
  }

  render() {
    const {
      current_user,
      is_logged_in,
      i_am_following,
      suggested_users,
      messages,
      ...props
    } = this.props;

    const client = new ApiClient(API_HOST);
    const triggers = new ActionsTrigger(client, this.props.dispatch);

    const doneInduction = () => {
      triggers.updateUserInfo({
        more: {
          first_login: false
        }
      });
    };

    if (!current_user.more.first_login) {
      return (
        <div>
          <Header is_logged_in={is_logged_in} current_user={current_user} />
          <div className="page__body">
            <InductionDone />
          </div>
          <Footer/>
        </div>
      );
    }

    return (
      <BaseInductionPage
        current_user={current_user}
        is_logged_in={is_logged_in}
        onNext={doneInduction}
        messages={messages}
        next_caption="Done"
        triggers={triggers}
      >
        <div className="paper__page">
          <h1 className="content__title">Thank you for registering!</h1>
          <p>To get started, follow a few people below:</p>
        </div>

        <div className="paper__page">
          <h2 className="content__sub_title layout__row">Suggested peers</h2>
          <div className="layout__row layout__row-double">
            <UserGrid
              current_user={current_user}
              i_am_following={i_am_following}
              triggers={triggers}
              users={suggested_users}
            />
          </div>
        </div>
      </BaseInductionPage>
    )
  }
}

export default connect(defaultSelector)(InductionPage);
