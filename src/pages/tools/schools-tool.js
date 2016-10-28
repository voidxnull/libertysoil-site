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
import Helmet from 'react-helmet';
import { Link } from 'react-router';
import { replace } from 'react-router-redux';

import { uuid4, Immutable as ImmutablePropType } from '../../prop-types/common';
import { MapOfSchools } from '../../prop-types/schools';
import { CurrentUser } from '../../prop-types/users';
import createSelector from '../../selectors/createSelector';
import currentUserSelector from '../../selectors/currentUser';
import { setSchoolsAlphabet } from '../../actions/tools';
import { ActionsTrigger } from '../../triggers';
import ApiClient from '../../api/client';
import { API_HOST } from '../../config';
import { TAG_SCHOOL } from '../../consts/tags';
import Button from '../../components/button';
import VisibilitySensor from '../../components/visibility-sensor';
import TagIcon from '../../components/tag-icon';
import FollowTagButton from '../../components/follow-tag-button';
import AlphabetFilter from '../../components/tools/alphabet-filter';


function SchoolList({ onClick, schools, selectedSchoolId }) {
  const items = schools.map((school, index) => {
    const handleClick = () => onClick(school.get('id'));
    let className = 'tools_page__item schools_tool__school_item';
    if (school.get('id') === selectedSchoolId) {
      className += ' tools_page__item-selected';
    }

    return (
      <div
        className={className}
        key={index}
        onClick={handleClick}
      >
        <TagIcon type={TAG_SCHOOL} />
        <span className="schools_tool__school_link">{school.get('name')}</span>
        <span
          className="schools_tool__post_count"
          title="Number of times this school was used"
        >
          ({school.get('post_count')})
        </span>
      </div>
    );
  });

  return (
    <div>
      {items}
    </div>
  );
}

function SchoolDescription({ current_user, school, triggers }) {
  if (school) {
    return (
      <div className="layout__grid_item-identical schools_tool__info_col">
        <div className="tools_page__item schools_tool__info ">
          <span className="micon schools_tool__info_icon">school</span>
          <div>
            <Link className="schools_tool__info_title" to={`/s/${school.get('url_name')}`}>
              {school.get('name')}
            </Link>
            <div className="schools_tool__info_description">
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

  return null;
}

const LIMIT = 25;

class SchoolsToolPage extends React.Component {
  static displayName = 'SchoolsToolPage';

  static propTypes = {
    all_schools_loaded: PropTypes.bool,
    current_user: ImmutablePropType(CurrentUser).isRequired,
    dispatch: PropTypes.func.isRequired,
    location: PropTypes.shape({
      pathname: PropTypes.string,
      query: PropTypes.shape({
        sort: PropTypes.string,
        startWith: PropTypes.string
      })
    }),
    schools: ImmutablePropType(MapOfSchools).isRequired,
    schools_alphabet: ImmutablePropType(PropTypes.arrayOf(PropTypes.string)),
    schools_river: ImmutablePropType(PropTypes.arrayOf(uuid4)).isRequired,
    ui: ImmutablePropType(
      PropTypes.shape({
        progress: ImmutablePropType(
          PropTypes.shape({
            loadingSchoolsRiver: PropTypes.bool.isRequired
          })
        ).isRequired
      })
    )
  };

  static async fetchData(router, store, client) {
    const trigger = new ActionsTrigger(client, store.dispatch);
    await trigger.toolsLoadSchoolsRiver({
      limit: LIMIT,
      ...router.location.query
    }, false);

    const alphabet = await client.schoolsAlphabet();
    store.dispatch(setSchoolsAlphabet(alphabet));
  }

  state = {
    // I've tried implementing this as a url param. It's not worth it.
    selectedSchoolId: null
  };

  async loadSchools(query = {}) {
    const client = new ApiClient(API_HOST);
    const trigger = new ActionsTrigger(client, this.props.dispatch);
    return await trigger.toolsLoadSchoolsRiver({
      limit: LIMIT,
      ...this.props.location.query,
      ...query
    });
  }

  handleLoadSchools = async () => {
    await this.loadSchools({
      offset: this.props.schools_river.size
    });
  };

  handleLoadOnSensor = async (isVisible) => {
    if (isVisible && !this.props.ui.getIn(['progress', 'loadingSchoolsRiver'])) {
      this.handleLoadSchools();
    }
  };

  handleSelectSchool = (selectedSchoolId) => {
    this.setState({ selectedSchoolId });
  };

  handleChangeSorting = async (e) => {
    const sort = e.target.value;

    this.props.dispatch(replace({
      pathname: this.props.location.pathname,
      query: Object.assign(this.props.location.query, {
        sort
      })
    }));

    await this.loadSchools({ offset: 0, sort });
    this.setState({ selectedSchoolId: null });
  };

  handleSelectLetter = async (letter) => {
    const query = this.props.location.query;

    if (letter === this.props.location.query.startWith) {
      delete query.startWith;
    } else {
      query.startWith = letter;
    }

    this.props.dispatch(replace({
      pathname: this.props.location.pathname,
      query
    }));

    await this.loadSchools(Object.assign(query, { offset: 0 }));
    this.setState({ selectedSchoolId: null });
  }

  render() {
    const {
      current_user,
      schools,
      schools_river,
      schools_alphabet,
      ui
    } = this.props;

    const client = new ApiClient(API_HOST);
    const triggers = new ActionsTrigger(client, this.props.dispatch);
    const followSchoolTriggers = { followTag: triggers.followSchool, unfollowTag: triggers.unfollowSchool };
    const schoolsToDisplay = schools_river.map(schoolId => schools.get(schoolId));
    const sortQuery = this.props.location.query.sort || 'name';

    let selectedSchool;
    if (this.state.selectedSchoolId) {
      selectedSchool = schools.get(this.state.selectedSchoolId);
    } else {
      selectedSchool = schools.get(schools_river.get(0));
    }

    return (
      <div className="layout">
        <Helmet title="Schools tool on " />
        <div className="schools_tool__list_col">
          <div className="schools_tool__filter">
            <div className="schools_tool__sort">
              <span className="micon">sort</span>
              <select value={sortQuery} onChange={this.handleChangeSorting}>
                <option value="name">Alphabetically</option>
                <option value="-updated_at">Last modified</option>
              </select>
            </div>
            <AlphabetFilter
              alphabet={schools_alphabet}
              selectedLetter={this.props.location.query.startWith}
              onSelect={this.handleSelectLetter}
            />
          </div>
          <SchoolList
            schools={schoolsToDisplay}
            selectedSchoolId={selectedSchool.get('id')}
            onClick={this.handleSelectSchool}
          />
          <div className="layout layout-align_center layout__space layout__space-double">
            {!this.props.all_schools_loaded &&
              <VisibilitySensor onChange={this.handleLoadOnSensor}>
                <Button
                  title="Load more..."
                  waiting={ui.getIn(['progress', 'loadingSchoolsRiver'])}
                  onClick={this.handleLoadSchools}
                />
              </VisibilitySensor>
            }
          </div>
        </div>
        <SchoolDescription
          current_user={current_user}
          school={selectedSchool}
          triggers={followSchoolTriggers}
        />
      </div>
    );
  }
}

const selector = createSelector(
  state => state.get('ui'),
  state => state.get('schools'),
  currentUserSelector,
  state => state.getIn(['tools', 'schools_river']),
  state => state.getIn(['tools', 'all_schools_loaded']),
  state => state.getIn(['tools', 'schools_alphabet']),
  (ui, schools, current_user, schools_river, all_schools_loaded, schools_alphabet) => ({
    ui,
    schools,
    schools_river,
    all_schools_loaded,
    schools_alphabet,
    ...current_user
  })
);

export default connect(selector)(SchoolsToolPage);