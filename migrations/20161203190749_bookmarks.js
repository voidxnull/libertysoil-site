export async function up(knex, Promise) {
  await knex.schema.createTable('bookmarks', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('user_id').references('id').inTable('users').onDelete('cascade').onUpdate('cascade');
    table.text('url');
    table.text('title');
    table.integer('ord').notNullable();
    table.jsonb('more');
    table.timestamp('created_at', true).defaultTo(knex.raw("(now() at time zone 'utc')"));
    table.timestamp('updated_at', true).defaultTo(knex.raw("(now() at time zone 'utc')"));

    table.unique(['user_id', 'ord']);
  });
}

export async function down(knex, Promise) {
  await knex.schema.dropTable('bookmarks');
}
