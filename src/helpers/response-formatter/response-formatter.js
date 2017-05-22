/* eslint-disable no-param-reassign */
import _ from 'lodash';

// TODO: Find a way to test this module

/* istanbul ignore next */
function load (data, page) {
  return function loadRequest (req, res, next) {
    req.resources = req.resources || { data: {} };

    _.assign(req.resources.data, data);
    req.resources.page = page || undefined;

    next();
  };
}

/* istanbul ignore next */
function send (req, res) {
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

    default: () => {
      res.send(406).send('Not Acceptable');
    }
  });
}


export default { load, send };
