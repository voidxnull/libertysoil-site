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
import { renderFile } from 'ejs';
import { promisify } from 'bluebird';
import moment from 'moment';

import { API_HOST } from '../config';


const renderFileAsync = promisify(renderFile);

export async function renderResetTemplate(dateObject, username, email, confirmationLink) {
  const date = moment(dateObject).format('Do [of] MMMM YYYY');

  return await renderFileAsync(
    `${__dirname}/reset.ejs`,
    { confirmationLink, date, email, host: API_HOST, username }
  );
}

export async function renderVerificationTemplate(dateObject, username, email, confirmationLink) {
  const date = moment(dateObject).format('Do [of] MMMM YYYY');

  return await renderFileAsync(
    `${__dirname}/verification.ejs`,
    {confirmationLink, date, email, host: API_HOST, username }
  );
}

export async function renderWelcomeTemplate(dateObject, username, email) {
  const date = moment(dateObject).format('Do [of] MMMM YYYY');

  return await renderFileAsync(
    `${__dirname}/welcome.ejs`,
    { date, email, host: API_HOST, username }
  );
}
