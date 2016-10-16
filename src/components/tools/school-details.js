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
import React from 'react';
import { Link } from 'react-router';

import {
  Immutable as ImmutablePropType
} from '../../prop-types/common';
import { CurrentUser } from '../../prop-types/users';
import { School } from '../../prop-types/schools';
import FollowTagButton from '../follow-tag-button';


export default function SchoolDetails({ current_user, school, triggers }) {
  if (!school) {
    return null;
  }

  return (
    <div className="tools_page__details_col">
      <div className="tools_details">
        <div className="tools_details__left_col">
          <span className="micon schools_tool__details_icon">school</span>
        </div>
        <div>
          <Link className="tools_details__title" to={`/s/${school.get('url_name')}`}>
            {school.get('name')}
          </Link>
          <div className="tools_details__description">
            {school.get('description')}
          </div>
          <FollowTagButton
            className="button-midi"
            current_user={current_user.toJS()}
            followed_tags={current_user.get('followed_schools').toJS()}
            key="follow"
            tag={school.get('url_name')}
            triggers={triggers}
          />
        </div>
      </div>
    </div>
  );
}

SchoolDetails.propTypes = {
  current_user: ImmutablePropType(CurrentUser).isRequired,
  school: ImmutablePropType(School).isRequired,
  triggers: FollowTagButton.propTypes.triggers.isRequired
};
