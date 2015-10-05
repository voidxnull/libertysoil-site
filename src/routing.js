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
import {Route, Redirect} from 'react-router';
import React from 'react';

import App from './pages/app'
import Auth from './pages/auth'
import MaybeList from './pages/maybe_list'
import PostPage from './pages/post'
import PostEditPage from './pages/post_edit'
import UserPage from './pages/user'

// <Redirect from="/user/:username" to="/user/:username/posts" />

let routes = (
  <Route component={App}>
    <Route component={MaybeList} name="post_list" path="/" />
    <Route component={Auth} name="auth" path="/auth" />
    <Route component={PostPage} name="post" path="/post/:uuid" />
    <Route component={PostEditPage} name="post" path="/post/edit/:uuid" />
    <Route component={UserPage} name="user" path="/user/:username" />
    <Route component={UserPage} name="user" path="/user/:username/:tab" />
  </Route>
);

export default routes;
