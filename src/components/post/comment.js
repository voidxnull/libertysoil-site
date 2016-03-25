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

import React from 'react';

import Time from '../time';
import User from '../user';
import Icon from '../icon';

let Comment = ({
  postId,
  comment,
  author,
  current_user,
  triggers
}) => {
  let toolbar = null;

  if (current_user.id == author.id) {
    toolbar = (
      <div className="comment__toolbar">
        {false && <Icon className="comment__toolbar_item" icon="edit" size="small" title="Edit" />}
        <Icon onClick={triggers.deleteComment.bind(null, postId, comment.id)} className="comment__toolbar_item" icon="delete" size="small" title="Delete" />
      </div>
    );
  }

  return (
    <article className="comment">
      <header className="comment__header">
        <div className="comment__author">
          <User user={author} />
        </div>
        {toolbar}
      </header>
      <div className="comment__body">
        <section className="comment__text">
          {comment.text}
        </section>
        <footer className="comment__footer">
          <Time className="comment__time" timestamp={comment.updated_at} />
        </footer>
      </div>
    </article>
  );

};
export default Comment;