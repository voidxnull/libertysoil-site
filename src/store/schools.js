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
import i from 'immutable';
import _ from 'lodash';

import * as a from '../actions';


const initialState = i.Map({});

export default function reducer(state=initialState, action) {
  switch (action.type) {
    case a.ADD_SCHOOL: {
      const school = action.school;
      state = state.set(school.id, i.fromJS(school));

      break;
    }

    case a.SET_SCHOOLS: {
      const schools = _.indexBy(action.schools, 'id');
      state = i.fromJS(schools);

      break;
    }
  }

  return state;
}
