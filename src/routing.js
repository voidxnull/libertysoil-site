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
import {Route, IndexRoute} from 'react-router';
import React from 'react';

import { combineHandlers, combineHandlersAsync } from './utils/loader';

import App from './pages/app';
import Auth from './pages/auth';
import NewPassword from './pages/new-password';
import PasswordReset from './pages/password-reset';
import PostPage from './pages/post';
import PostEditPage from './pages/post_edit';
import UserPage from './pages/user';
import UserLikesPage from './pages/user-likes';
import UserFavoritesPage from './pages/user-favorites';
import AboutUserPage from './pages/user-bio';
import SchoolPage from './pages/school';
import SchoolEditPage from './pages/school-edit';
import SettingsPage from './pages/settings';
import SettingsPasswordPage from './pages/settings-password';
import SettingsFollowersPage from './pages/settings-followers';
import TagPage from './pages/tag';
import TagCloudPage from './pages/tag-cloud';
import CityPage from './pages/city';
import CountryPage from './pages/country';

import List from './pages/list';
import Induction from './pages/induction';
import Welcome from './pages/welcome';

export function getRoutes(authHandler, fetchHandler) {
  let withoutAuth = fetchHandler;
  let withAuth;

  if (authHandler.length >= 3 || fetchHandler.length >= 3) {
    withAuth = combineHandlersAsync(authHandler, fetchHandler);
  } else {
    withAuth = combineHandlers(authHandler, fetchHandler);
  }

  return (
    <Route component={App}>
      <Route component={List} path="/" onEnter={withAuth} />
      <Route component={Induction} path="/induction" onEnter={withAuth} />
      <Route component={Welcome} path="/welcome" onEnter={withoutAuth} />
      <Route component={Auth} path="/auth" onEnter={withoutAuth} />
      <Route component={PostPage} path="/post/:uuid" onEnter={withoutAuth} />
      <Route component={PostEditPage} path="/post/edit/:uuid" onEnter={withAuth} />
      <Route path="/tag">
        <IndexRoute component={TagCloudPage} onEnter={withoutAuth} />
        <Route component={TagPage} path=":tag" onEnter={withoutAuth} />
      </Route>
      <Route path="/settings">
        <IndexRoute component={SettingsPage} onEnter={withAuth} />
        <Route component={SettingsPasswordPage} path="password" onEnter={withAuth} />
        <Route component={SettingsFollowersPage} path="followers" onEnter={withAuth} />
      </Route>
      <Route path="/user/:username">
        <IndexRoute component={UserPage} onEnter={withoutAuth} />
        <Route component={UserLikesPage} path="/user/:username/likes" onEnter={withoutAuth} />
        <Route component={UserFavoritesPage} path="/user/:username/favorites" onEnter={withoutAuth} />
        <Route component={AboutUserPage} path="/user/:username/bio" onEnter={withoutAuth} />
      </Route>
      <Route path="/s/:school_name">
        <IndexRoute component={SchoolPage} onEnter={withoutAuth} />
        <Route component={SchoolEditPage} path="/s/:school_name/edit" onEnter={withAuth} />
      </Route>
      <Route path="/l/:country">
        <IndexRoute component={CountryPage} onEnter={withoutAuth} />
        <Route component={CityPage} path="/l/:country/:city" onEnter={withoutAuth} />
      </Route>
      <Route component={PasswordReset} path="/resetpassword" onEnter={withoutAuth} />
      <Route component={NewPassword} path="/newpassword/:hash" onEnter={withoutAuth} />
    </Route>
  );
}
