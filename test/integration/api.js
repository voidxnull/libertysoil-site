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
/* eslint-env node, mocha */
/* global $dbConfig */
import { v4 as uuid4 } from 'uuid';
import bcrypt from 'bcrypt'
import bb from 'bluebird'

import expect from '../../test-helpers/expect';
import initBookshelf from '../../src/api/db';
import { login, POST_DEFAULT_TYPE } from '../../test-helpers/api';
import QueueSingleton from '../../src/utils/queue';
import HashtagFactory from '../../test-helpers/factories/hashtag';
import PostFactory from '../../test-helpers/factories/post';


let bcryptAsync = bb.promisifyAll(bcrypt);
let bookshelf = initBookshelf($dbConfig);
let Post = bookshelf.model('Post');
let User = bookshelf.model('User');
let Hashtag = bookshelf.model('Hashtag');

const range = (start, end) => [...Array(end - start + 1)].map((_, i) => start + i);

describe('api v.1', () => {

  describe('Validation', () => {

    describe('Registration Rules', () => {

      it('FAILS for some base rules', async () => {
        await expect({ url: `/api/v1/users`, method: 'POST', body: {
          username: '#abcdefghijklmnopqrstuvwxyz_abcdefghijklmnopqrstuvwxyz', // 49
          password: "test",
          email: 'test'
        }}, 'to validation fail with', {
          username: ['The username must not exceed 31 characters long',
                     'Username can contain letters a-z, numbers 0-9, dashes (-), underscores (_), apostrophes (\'), and periods (.)'
                    ],
          password: ['Password is min. 8 characters. Password can only have ascii characters.'],
          email: [ 'The email must be a valid email address' ]
        });
      });

      it('FAILS when password contain special(non visible ascii) characters', async () => {
        await expect({ url: `/api/v1/users`, method: 'POST', body: {
          username: 'user',
          password: "testtest\x00",
          email: 'test@example.com'
        }}, 'to validation fail with', {
          password: ['Password is min. 8 characters. Password can only have ascii characters.']
        });
      });

      it('FAILS when no required attributes passed', async () => {
        await expect({ url: `/api/v1/users`, method: 'POST', body: {
        }}, 'to validation fail with', {
          username: ['The username is required'],
          password: ['The password is required'],
          email: ['The email is required']
        });
      });

      describe ('Email validation', async () => {
        let validEmails = [
          'test@domain.com',
          'firstname.lastname@domain.com',
          'email@subdomain.domain.com',
          'firstname+lastname@domain.com',
          'email@123.123.123.123',
          '""email""@domain.com',
          '1234567890@domain.com',
          'email@domain-one.co',
          '_______@domain.com',
          'email@domain.nam',
          'email@domain.co.jp',
          'firstname-lastname@domain.com'
        ];

        let invalidEmails = [
          'plainaddress',
          '#@%^%@$@#$@#.com',
          '@domain.com',
          'Joe Smith <email@domain.com>',
          'email.domain.com',
          'email@domain@domain.com',
          '.email@domain.com',
          'email.@domain.com',
          'email..email@domain.com',
          'あいうえお@domain.com',
          'email@domain.com (Joe Smith)',
          'email@domain',
          'email@-domain.com',
          // 'email@domain.web',
          // 'email@111.222.333.44444',
          'email@domain..com'
        ];

        validEmails.map((email) => {
          it(`PASS email validation with email: ${email}`, async function() {
            // prove that there is no email validation errors
            await expect({ url: `/api/v1/users`, method: 'POST', body: {
              email: email
            }}, 'to validation fail with', {
              username: ['The username is required'],
              password: ['The password is required']
            });
          });
        });

        invalidEmails.map((email) => {
          it(`FAIL email validation with email: ${email}`, async function() {
            // prove that there is no email validation errors
            await expect({ url: `/api/v1/users`, method: 'POST', body: {
              email: email
            }}, 'to validation fail with', {
              username: ['The username is required'],
              password: ['The password is required'],
              email: ['The email must be a valid email address']
            });
          });
        });
      });
    });
  });

  describe('Functional', () => {
    describe('Kue', () => {
      let queue;

      before(() => {
        queue = new QueueSingleton().handler;
        queue.testMode.enter();
      });

      after(() => {
        queue.testMode.exit();
      });

      describe('when user does not exist', () => {
        beforeEach(async () => {
          await bookshelf.knex('users').del();
        });

        afterEach(async () => {
          await bookshelf.knex('users').del();
          queue.testMode.clear();
        });

        it('Create new queue job after user registration', async () => {
          await expect({ url: `/api/v1/users`, method: 'POST', body: {
            username: 'test',
            password: 'testPass',
            email: 'test@example.com'
          }}, 'to open successfully');

          expect(queue.testMode.jobs.length,'to equal', 1);
          expect(queue.testMode.jobs[0].type, 'to equal', 'register-user-email');
          expect(queue.testMode.jobs[0].data, 'to satisfy', { username: 'test', email: 'test@example.com' });
        });
      });

      describe('when user exists', () => {
        let user;

        beforeEach(async () => {
          await bookshelf.knex('users').del();

          user = await User.create('test2', 'testPassword', 'test2@example.com');
          await user.save({'email_check_hash': ''},{require:true});
        });

        afterEach(async () => {
          await user.destroy();
          queue.testMode.clear();
        });

        it('Create new queue job after user request reset password', async () => {
          await expect({ url: `/api/v1/resetpassword`, method: 'POST', body: {
            email: 'test2@example.com'
          }}, 'to open successfully');

          expect(queue.testMode.jobs.length,'to equal', 1);
          expect(queue.testMode.jobs[0].type, 'to equal', 'reset-password-email');
          expect(queue.testMode.jobs[0].data, 'to satisfy', { username: 'test2', email: 'test2@example.com' });
        });
      })
    });

    describe('Authenticated user', () => {
      let user,
          sessionId;

      before(async () => {
        await bookshelf.knex('users').del();
        user = await User.create('mary', 'secret', 'mary@example.com');
        await user.save({email_check_hash: ''}, {require: true});

        sessionId = await login('mary', 'secret');
      });

      after(async () => {
        await user.destroy();
      });

      describe('User settings', () => {
        it('bio update works', async () => {
          await expect(
            { url: `/api/v1/user`, session: sessionId, method: 'POST', body: {more: {bio: 'foo'}} }
            , 'to open successfully');

          let localUser = await User.where({id: user.id}).fetch({require: true});

          expect(localUser.get('more').bio, 'to equal', 'foo');
        });
      });

      describe('Posts', () => {
        let post;

        beforeEach(async () => {
            await bookshelf.knex('posts').del();

            post = new Post({
              id: uuid4(),
              type: POST_DEFAULT_TYPE,
              text: `This is clean post`
            });
            await post.save({}, {method: 'insert'});
        });

        afterEach(async () => {
          await post.destroy();
        });

        describe('Subscriptions', () => {
          let posts;

          beforeEach(async () => {
            await bookshelf.knex('posts').del();

            posts = await Promise.all(range(1, 10).map(i => {
              const post = new Post({
                id: uuid4(),
                type: POST_DEFAULT_TYPE,
                user_id: user.get('id'),
                text: `This is a Post #${i}`
              });
              return post.save({fully_published_at: (new Date(Date.now() - 50000 + i*1000)).toJSON()}, {method: 'insert'});
            }));

          });

          afterEach(async () => {
            await Promise.all(posts.map(post => post.destroy()));
          });

          it('First page of subscriptions should return by-default', async () => {
            await expect(
              { url: `/api/v1/posts`, session: sessionId },
              'to body satisfy', [{text: 'This is a Post #10'}, {text: 'This is a Post #9'}, {text: 'This is a Post #8'}, {text: 'This is a Post #7'}, {text: 'This is a Post #6'}]
            );
          });

          it('Other pages of subscriptions should work', async () => {
            await expect(
              { url: `/api/v1/posts?offset=4`, session: sessionId },
              'to body satisfy', [{text: 'This is a Post #6'}, {text: 'This is a Post #5'}, {text: 'This is a Post #4'}, {text: 'This is a Post #3'}, {text: 'This is a Post #2'}]
            );
          });
        });

        describe('Favourites', () => {

          beforeEach(async () => {
          });

          afterEach(async () => {
          });

          it('CAN fav post', async () => {
            await expect(
              { url: `/api/v1/post/${post.id}/fav`, session: sessionId, method: 'POST' },
              'to open successfully'
            );
            let localUser = await User.where({id: user.id}).fetch({require: true, withRelated: ['favourited_posts']});

            expect(localUser.related('favourited_posts').length, 'to equal', 1);
            expect(localUser.related('favourited_posts').models[0].get('text'), 'to equal', 'This is clean post');
          });

          it('CAN unfav post', async () => {
            await user.favourited_posts().attach(post);
            await expect(
              { url: `/api/v1/post/${post.id}/unfav`, session: sessionId, method: 'POST' },
              'to open successfully'
            );
            let localUser = await User.where({id: user.id}).fetch({require: true, withRelated: ['favourited_posts']});

            expect(localUser.related('favourited_posts').models, 'to be empty');
          });

          it('Favoured list should work', async () => {
            await user.favourited_posts().attach(post);
            await expect(
              { url: `/api/v1/posts/favoured`, session: sessionId },
              'to body satisfy', [{text: 'This is clean post'}]
            );
          });
        });

        describe('Likes', () => {

          beforeEach(async () => {
          });

          afterEach(async () => {
            await user.liked_posts().detach(post);
          });

          it('CAN like post', async () => {
            await expect(
              { url: `/api/v1/post/${post.id}/like`, session: sessionId, method: 'POST' },
              'to open successfully'
            );
            let localUser = await User.where({id: user.id}).fetch({require: true, withRelated: ['liked_posts']});

            expect(localUser.related('liked_posts').length, 'to equal', 1);
            expect(localUser.related('liked_posts').models[0].get('text'), 'to equal', 'This is clean post');
          });

          it('CAN unlike post', async () => {
            await user.liked_posts().attach(post);
            await expect(
              { url: `/api/v1/post/${post.id}/unlike`, session: sessionId, method: 'POST' },
              'to open successfully'
            );
            let localUser = await User.where({id: user.id}).fetch({require: true, withRelated: ['liked_posts']});

            expect(localUser.related('liked_posts').models, 'to be empty');
          });

          it('Liked list should work', async () => {
            await user.liked_posts().attach(post);
            await expect(
              { url: `/api/v1/posts/liked`, session: sessionId },
              'to body satisfy', [{text: 'This is clean post'}]
            );
          });
        });
      });

      describe('Hastags', () => {

        it("sends an array of tags, where each tag used in multiple posts appears only once", async () => {
          let hashtag = await new Hashtag(HashtagFactory.build()).save(null, {method: 'insert'});

          let post1 = await new Post(PostFactory.build({user_id: user.id})).save(null, {method: 'insert'});
          post1.hashtags().attach(hashtag);
          let post2 = await new Post(PostFactory.build({user_id: user.id})).save(null, {method: 'insert'});
          post2.hashtags().attach(hashtag);

          await expect({url: `/api/v1/user/tags`, session: sessionId}, 'to body have array length', 1);
        });

      });

    });


    describe('Not authenticated user', () => {
      describe('Change password', () => {
        let resetPasswordUser;

        before(async () => {
          await bookshelf.knex('users').del();

          resetPasswordUser = await User.create('reset', 'testPassword', 'reset@example.com');
          await resetPasswordUser.save({email_check_hash: '', reset_password_hash: 'foo'}, {require: true});
        });

        after(async () => {
          await resetPasswordUser.destroy();
        });

        it('New password works', async () => {
          await expect({ url: `/api/v1/newpassword/foo`, method: 'POST', body: {
            password: 'foo',
            password_repeat: 'foo'
          }}, 'to open successfully');

          let localUser = await User.where({id: resetPasswordUser.id}).fetch({require: true});
          const passwordValid = await bcryptAsync.compareAsync('foo', await localUser.get('hashed_password'));

          expect(passwordValid, 'to be true');
          expect(localUser.get('reset_password_hash'), 'to be empty');
        });
      });

      describe('Posts', () => {
        let post;
        beforeEach(async () => {
          await bookshelf.knex('posts').del();

          post = new Post({
            id: uuid4(),
            type: POST_DEFAULT_TYPE,
            text: `This is a test Post`
          });
          await post.save({}, {method: 'insert'});
        });

        afterEach(async () => {
          await post.destroy();
        });

        it('Tag page should work', async () => {
          await post.attachHashtags(['foo']);
          await expect(
            { url: `/api/v1/posts/tag/foo` },
            'to body satisfy', [{text: post.get('text')}]
          );
        });

        describe('Favorites', () => {
          let user;

          beforeEach(async () => {
            await bookshelf.knex('users').del();
            user = await User.create('mary', 'secret', 'mary@example.com');
          });

          afterEach(async () => {
            await user.destroy();
          });

          it('Favoured posts for user should work', async () => {
            await user.favourited_posts().attach(post);
            await expect(
              { url: `/api/v1/posts/favoured/${user.get('username')}` },
              'to body satisfy', [{text: post.get('text')}]
            );
          });
        });

        describe('Likes', () => {
          let user;

          beforeEach(async () => {
            await bookshelf.knex('users').del();
            user = await User.create('mary', 'secret', 'mary@example.com');
          });

          afterEach(async () => {
            await user.destroy();
          });

          it('Liked posts for user should work', async () => {
            await user.liked_posts().attach(post);
            await expect(
              { url: `/api/v1/posts/liked/${user.get('username')}` },
              'to body satisfy', [{text: post.get('text')}]
            );
          });
        });

        describe('Geotags', () => {

          it('Non existing geotag page should answer "Not found"', async () => {
            await expect(
              { url: `/api/v1/posts/geotag/non-existing-geotag` } ,
              'to open not found'
            );
          });

        });
      });

    });
  });
});
