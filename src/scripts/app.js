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
import bluebird from 'bluebird';
import React from 'react'
import ReactDOM from 'react-dom'
import { createHistory } from 'history'
import { Router } from 'react-router';
import { Provider } from 'react-redux';
import { syncReduxAndRouter } from 'redux-simple-router';
import 'mapbox.js';

import { getRoutes } from '../routing'
import { AuthHandler, FetchHandler } from '../utils/loader';
import { API_HOST } from '../config';
import ApiClient from '../api/client';
import { initState } from '../store'

bluebird.longStackTraces();
window.Promise = bluebird;

let store = initState(window.state);

let history = createHistory();
let authHandler = new AuthHandler(store);
let fetchHandler = new FetchHandler(store, new ApiClient(API_HOST));

syncReduxAndRouter(history, store, state => state.get('routing'));

ReactDOM.render(
  <Provider store={store}>
    <Router history={history}>
      {getRoutes(authHandler.handle, fetchHandler.handle)}
    </Router>
  </Provider>,
  document.getElementById('content')
);
