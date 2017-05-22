
exports.seed = function(knex, Promise) {
  const tableName = 'birds';
  const tableData = [{
    id: 1,
    owner: 1,
    name: 'Pigeon',
    species: 'Columbidae',
    pictureUrl: 'http://pngimg.com/upload/pigeon_PNG3423.png',
    isPublic: true,
  }, {
    id: 2,
    owner: 2,
    name: 'Mourning dove',
    species: 'Zenaida',
    pictureUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/Mourning_Dove_2006.jpg/220px-Mourning_Dove_2006.jpg',
    isPublic: false,
  }];

  return knex(tableName)
    .del()
    .then(function () {
      return knex(tableName).insert(tableData);
    });
};
