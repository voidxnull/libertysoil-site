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

import * as PostTypes  from '../consts/postTypeConstants';
import * as TagTypes from '../consts/tags';
import User from './user';
import Tag from './tag';
import Time from './time';


export default class TagLikePost extends React.Component {
  static propTypes = {
    author: PropTypes.shape(),
    post: PropTypes.shape({
      liked_hashtag: PropTypes.shape({
        name: PropTypes.string
      }),
      liked_school: PropTypes.shape({
        name: PropTypes.string,
        url_name: PropTypes.string
      }),
      liked_geotag: PropTypes.shape({
        name: PropTypes.string,
        url_name: PropTypes.string
      })
    })
  };

  render() {
    const {
      author,
      post
    } = this.props;

    let tag;

    switch (post.type) {
      case PostTypes.HASHTAG_LIKE:
        tag = (
          <Tag
            name={post.liked_hashtag.name}
            type={TagTypes.TAG_HASHTAG}
            urlId={post.liked_hashtag.name}
          />
        );
        break;
      case PostTypes.SCHOOL_LIKE:
        tag = (
          <Tag
            name={post.liked_school.name}
            type={TagTypes.TAG_SCHOOL}
            urlId={post.liked_school.url_name}
          />
        );
        break;
      case PostTypes.GEOTAG_LIKE:
        tag = (
          <Tag
            name={post.liked_geotag.name}
            type={TagTypes.TAG_LOCATION}
            urlId={post.liked_geotag.url_name}
          />
        );
        break;
    }

    return (
      <section className="card card-padded card-with_bg">
        <div className="layout__grid layout-align_vertical">
          <div className="layout__grid_item">
            {tag}
          </div>
          <div className="layout__grid_item">
            was liked by
          </div>
          <div className="layout__grid_item">
            <User avatarSize="32" user={author} />
          </div>
          <div className="layout__grid_item layout__grid_item-wide"></div>
          <div className="layout__grid_item">
            <Time timestamp={post.created_at} className="card__timestamp" />
          </div>
        </div>
      </section>
    );
  }
}
