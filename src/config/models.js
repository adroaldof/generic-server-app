import glob from 'glob';


function init (app) {
  const models = glob.sync('**/*model.js', { cwd: String(app.get('root')).concat('/src/api') });

  models.forEach((model) => {
    // TODO: check a way to replace require by import
    require(String('../api/').concat(model)); // eslint-disable-line global-require
  });
}

export default init;
