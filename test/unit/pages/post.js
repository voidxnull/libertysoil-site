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
/*eslint-env node, mocha */
import { TestUtils, expect, React } from '../../../test-helpers/expect-unit';

import { PostPage } from '../../../src/pages/post';
import NotFound from '../../../src/pages/not-found';


describe('Post page', function() {

  it('MUST renders as empty script when post is not yet fetched', function() {
    let renderer = TestUtils.createRenderer();
    renderer.render(<PostPage params={{uuid: 'xxx'}} posts={{}} />);

    return expect(renderer, 'to have rendered', <script />);
  });

  it('MUST renders as <NotFound /> page when post is not exist', function() {
    let renderer = TestUtils.createRenderer();
    renderer.render(<PostPage params={{uuid: 'xxx'}} posts={{'xxx': false}} />);

    return expect(renderer, 'to have rendered', <NotFound />);
  });

});