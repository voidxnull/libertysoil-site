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
import React, { PropTypes } from 'react';
import { Link, IndexLink } from 'react-router';
import { find } from 'lodash';

import {
  Page,
  PageMain,
  PageCaption,
  PageHero,
  PageBody,
  PageContent
}                       from '../../components/page';
import Header           from '../../components/header';
import HeaderLogo       from '../../components/header-logo';
import CreatePost       from '../../components/create-post';
import TagBreadcrumbs   from '../../components/breadcrumbs/tag-breadcrumbs';
import Footer           from '../../components/footer';
import SchoolHeader     from '../../components/school-header';
import Sidebar          from '../../components/sidebar';
import SidebarAlt       from '../../components/sidebarAlt';
import AddedTags        from '../../components/post/added-tags';
import { TAG_SCHOOL, TAG_LOCATION, TAG_HASHTAG }   from '../../consts/tags';

function formInitialTags(type, value) {
  switch (type) {
    case TAG_SCHOOL:
      return { schools: value };
    case TAG_LOCATION:
      return { hashtags: value };
    case TAG_HASHTAG:
      return { geotags: value };
    default:
      return {};
  }
}

export default class BaseSchoolPage extends React.Component {
  static displayName = 'BaseSchoolPage';

  static propTypes = {
    actions: PropTypes.shape({
      resetCreatePostForm: PropTypes.func.isRequired,
      updateCreatePostForm: PropTypes.func.isRequired
    }).isRequired,
    schools: PropTypes.arrayOf(PropTypes.shape()).isRequired,
    page_school: PropTypes.shape({
      url_name: PropTypes.string.isRequired
    }).isRequired
  };

  state = {
    form: false
  };

  postsAmount = null;

  componentWillMount() {
    this.postsAmount = this.props.postsAmount;    
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.form) {
      if (this.postsAmount != nextProps.postsAmount) {
        this.setState({ form: false });
      }
    }
    this.postsAmount = nextProps.postsAmount;
  }

  componentWillUnmount() {
    this.props.actions.resetCreatePostForm();
  }

  toggleForm = () => {
    if (!this.state.form) {
      const school = this.props.page_school;
      this.props.actions.resetCreatePostForm();
      this.props.actions.updateCreatePostForm(formInitialTags(TAG_SCHOOL, [school]));
    }

    this.setState({ form: !this.state.form });
  };

  render() {
    let {
      current_user,
      page_school,
      is_logged_in,
      actions,
      triggers,
      schools,
      postsAmount
    } = this.props;

    let createPostForm;
    let addedTags;
    if (is_logged_in) {

      if (this.state.form) {
        createPostForm = (
          <CreatePost
            actions={actions}
            allSchools={schools}
            defaultText={this.props.create_post_form.text}
            triggers={triggers}
            userRecentTags={current_user.recent_tags}
            {...this.props.create_post_form}
          />
        );
        addedTags = <AddedTags {...this.props.create_post_form} />;
      }
    }

    return (
      <div>
        <Header is_logged_in={is_logged_in} current_user={current_user}>
          <HeaderLogo small />
          <TagBreadcrumbs type={TAG_SCHOOL} tag={page_school} />
        </Header>

        <Page>
          <Sidebar current_user={current_user} />
          <PageMain className="page__main-no_space">
            <PageCaption>
              {page_school.name}
            </PageCaption>
            <PageHero src="/images/hero/welcome.jpg" />
            <PageBody className="page__body-up">
              <SchoolHeader
                is_logged_in={is_logged_in}
                school={page_school}
                current_user={current_user}
                triggers={triggers}
                newPost={this.toggleForm}
                schoolPostsAmount={postsAmount}
              />
            </PageBody>
            <PageBody className="page__body-up">
              <PageContent>
                <div className="layout__space-double">
                  <div className="layout__row">
                    {createPostForm}
                    {this.props.children}
                  </div>
                </div>
              </PageContent>
              <SidebarAlt>
                {addedTags}
              </SidebarAlt>
            </PageBody>
          </PageMain>
        </Page>

        <Footer/>
      </div>
    );
  }
}
