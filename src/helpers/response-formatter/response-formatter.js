import _ from 'lodash';


function load (data, page) {
    return function (req, res, next) {
        req.resources = req.resources || { data: {} };

        _.assign(req.resources.data, data);
        req.resources.page = page || undefined;

        next();
    }
}


function send (req, res, next) {
    const resources = req.resources;

    return res.format({
        'text/html': () => {
            if (resources && resources.shouldRedirect) {
                return res.redirect(302, resources.page);
            }

            return res.render(resources.page, resources.data || resources.error);
        },

        'application/json': () => {
            res.send(resources);
        },

        'default': () => {
            res.send(406).send('Not Acceptable');
        }
    });
}


export default { load, send }
