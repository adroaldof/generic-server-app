import glob from 'glob';


function init (app) {
    const models = glob.sync('**/*.model.js', {cwd: app.get('root') + '/src/api'});

    models.forEach((model) => {
        require(String('../api/').concat(model));
    });
}

export default init;
