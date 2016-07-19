function responseFormatter (data, page) {
    return function (req, res, next) {
        return res.format({
            'text/html': () => {
                res.render(page, data);
            },

            'application/json': () => {
                res.send(data);
            },

            'default': () => {
                res.send(406).send('Not Acceptable');
            }
        });
    }
}

export default { responseFormatter }
