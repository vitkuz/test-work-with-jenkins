const express = require('express');
const cors = require('cors');

const ServiceDiscovery = require('./service-discovery');

const app = express();

app.use(cors());

app.get('/service/find/:name/:version', (req, res) => {
    const { name, version } = req.params;

    const result = ServiceDiscovery.get({ name, version });

    console.log(result);

    res.json(result)
});

app.delete('/service/register/:name/:version/:port', (req, res) => {
    const { name, version, port } = req.params;

    const ip = req.connection.remoteAddress.includes('::') ?  `[${req.connection.remoteAddress}]` : req.connection.remoteAddress;

    const result = ServiceDiscovery.deregister({ ip, name, version, port });

    res.json(result)
});

app.put('/service/register/:name/:version/:port', (req, res) => {
    const { name, version, port } = req.params;

    const ip = req.connection.remoteAddress.includes('::') ?  `[${req.connection.remoteAddress}]` : req.connection.remoteAddress;

    const result = ServiceDiscovery.register({ ip, name, version, port });

    res.json(result)
});

app.listen(3000, () => console.log(`Service discovery listens on port 3000`));
