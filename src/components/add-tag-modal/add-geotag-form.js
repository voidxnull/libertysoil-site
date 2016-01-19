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
import React, { PropTypes, Component } from 'react';

import GeotagSelect from './geotag-select';
import { preventDefault } from '../../utils/preventDefault';


export default class AddGeotagForm extends Component {
  static displayName = 'AddGeotagForm';

  static propTypes = {
    addedGeotags: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string
    })).isRequired,
    onAddGeotag: PropTypes.func.isRequired
  };

  _addTag = (geotag) => {
    let { addedGeotags } = this.props;

    if (!geotag.id) {
      return;
    }

    if (addedGeotags.find(g => g.id === geotag.id)) {
      return;
    }

    this._input.reset();

    this.props.onAddGeotag(geotag);
  };

  render() {
    return (
      <div className="add_tag_modal add_tag_modal-location">
        <div className="add_tag_modal__tabs">
          <div className="add_tag_modal__tab add_tag_modal__tab-active">Enter manually</div>
        </div>

        <div>
          <div className="layout__row add_tag_modal__tab_panel">
            <div className="layout">
              <div className="layout__grid_item layout__grid_item-wide">
                <form ref="form" onSubmit={preventDefault}>
                  <GeotagSelect
                    placeholder="Start typing..."
                    ref={(c) => this._input = c}
                    onSelect={this._addTag}
                  />
                </form>
              </div>
              <div className="layout__grid_item">
                  <span
                    className="button button-wide add_tag_modal__add_button action"
                  >
                    Add
                  </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

}