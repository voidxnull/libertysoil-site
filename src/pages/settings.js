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

import BaseSettingsPage from './base/settings'

import ApiClient from '../api/client'
import {API_HOST} from '../config';
import {getStore, addUser} from '../store';
import {followUser, unfollowUser} from '../triggers'
import { defaultSelector } from '../selectors';

class SettingsPage extends React.Component {
  static displayName = 'SettingsPage'

  componentDidMount () {
    SettingsPage.fetchData(this.props);
  }

  static async fetchData (props) {
    let client = new ApiClient(API_HOST);

    if (!props.current_user) {
      return;
    }

    try {
      let userInfo = client.userInfo(props.current_user.username);
      getStore().dispatch(addUser(await userInfo));
    } catch (e) {
      console.log(e.stack)
    }
  }

  render () {
    if (!this.props.is_logged_in) {
      return <script/>;
    }

    let user_triggers = {followUser, unfollowUser};

    return (
      <BaseSettingsPage
        user={this.props.current_user}
        i_am_following={this.props.i_am_following}
        is_logged_in={this.props.is_logged_in}
        triggers={user_triggers}
      >
        Settings...
      </BaseSettingsPage>
    )
  }
}

export default connect(defaultSelector)(SettingsPage);