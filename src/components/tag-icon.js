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

import { TAG_HASHTAG, TAG_SCHOOL, TAG_MENTION, TAG_LOCATION, TAG_EVENT, TAG_PLANET } from '../consts/tags';

export default class TagIcon extends React.Component {
  static displayName = 'TagIcon';

  static propTypes = {
    big: PropTypes.bool,
    className: PropTypes.string,
    inactive: PropTypes.bool,
    small: PropTypes.bool,
    type: PropTypes.oneOf([TAG_HASHTAG, TAG_SCHOOL, TAG_MENTION, TAG_LOCATION, TAG_EVENT, TAG_PLANET]).isRequired
  };

  render() {
    const { className, small, big, inactive, ...props } = this.props;

    let cn = 'tag_icon';

    if (className) {
      cn += ` ${className}`;
    }

    if (small) {
      cn += ' tag_icon-small';
    }

    if (big) {
      cn += ' tag_icon-big';
    }

    if (inactive) {
      cn += ' tag_icon-inactive';
    }

    switch (this.props.type) {
      case TAG_HASHTAG:
        return (
          <span className={`${cn} tag_icon-hashtag`} {...props}>#</span>
        );
      case TAG_SCHOOL:
        return (
          <span className={`${cn} tag_icon-school`} {...props}><span className="micon">school</span></span>
        );
      case TAG_MENTION:
        return (
          <span className={`${cn} tag_icon-mention`} {...props}>@</span>
        );
      case TAG_LOCATION:
        return (
          <span className={`${cn} tag_icon-location`} {...props}><span className="micon">location_on</span></span>
        );
      case TAG_EVENT:
        return (
          <span className={`${cn} tag_icon-event`} {...props}><span className="micon">event</span></span>
        );
      case TAG_PLANET:
        return (
          <span className={`${cn} tag_icon-planet`} {...props}><span className="micon">public</span></span>
        );
      default:
        return false;
    }
  }
}
