exports.seed = function (knex, Promise) {
  const tableName = 'users';
  const tableData = [{
    id: 1,
    name: 'James logan',
    email: 'james@wolverine.com',
    password: 'password'
  }, {
    id: 2,
    name: 'Lara Croft',
    email: 'lara@croft.com',
    password: 'password'
  }, {
    id: 3,
    name: 'Sub Zero',
    email: 'sub@zero.com',
    password: 'password'
  }];

  return knex(tableName)
    .del()
    .then(function () {
      return knex(tableName).insert(tableData);
    });
};

