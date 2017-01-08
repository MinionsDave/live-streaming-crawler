exports.create = function(req, res) {
    if (req.body.username === 'Jax2000' && req.body.password === '1') return res.end();
    res.status(401).end();
};
