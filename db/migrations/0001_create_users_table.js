exports.up = (knex, Promise) => { // eslint-disable-line no-unused-vars
  return knex
    .schema
    .createTable('users', table => {
      table.increments('id').primary();
      table.text('name');
      table.text('email').notNullable().unique();
      table.text('password').notNullable();
      table.boolean('admin').notNullable().defaultTo(false);
      table.timestamp('createdAt').defaultTo(knex.fn.now());
      table.timestamp('updatedAt').defaultTo(knex.fn.now());
      table.enum('status', ['active', 'inactive', 'deleted'])
        .defaultTo('active').index('index_users_status');
    });
};

exports.down = (knex, Promise) => { // eslint-disable-line no-unused-vars
  return knex
    .schema
    .dropTableIfExists('users');
};
