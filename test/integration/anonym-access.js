/*eslint-env node, mocha */
/*global $dbConfig */
import uuid from 'uuid';

import expect from '../../test-helpers/expect';
import initBookshelf from '../../src/api/db';


let bookshelf = initBookshelf($dbConfig);
let User = bookshelf.model('User');

describe('pages that are available for anonym', function () {

  describe('when user is not logged in', function () {
    beforeEach(async function () {
      await new User({
        id: uuid.v4(),
        username: 'john',
        more: '{"lastName": "Smith", "firstName": "John"}',
        email: 'john@example.com'
      }).save(null, {method: 'insert'});
    });

    afterEach(async function () {
      await bookshelf.knex.raw('DELETE FROM users WHERE username=\'john\';');
    });

    it('User profile page works', async function () {
      return expect(`/user/john`, 'to body contains', 'John Smith');
    });
  });

});
