const express = require('express');
const app = express();
const axios = require('axios').default;
const replacer = require('./lib/replaceUrls');
const port = 3200;
const url = `localhost:${port}`;
const apiSitesToSkip = [
    'ecsv2',
    'locale',
    'apis',
    'metrics',
    'authsite',
];

app.get('/', (req, res, next) => {
    axios.get(`https://www.roblox.com/`, { maxRedirects: 0, validateStatus: (num) => true })
        .then(d => {
            if (typeof d.data === "string") {
                res.send(replacer(d.data, url)).end();
            } else {
                res.send(d.data).end();
            }
        })
        .catch(next);
});

app.all('/apisite/:name*', (req, res, next) => {
    if (apiSitesToSkip.includes(req.params.name)) {
        let url = `https://${req.params.name}.roblox.com/${req.url.slice('/apisite/'.length + req.params.name.length + 1)}`;
        return axios.request({
            method: req.method,
            url: url,
            data: req.body,
            responseType: 'arraybuffer',
            validateStatus: () => true,
        }).then(d => {
            res.set('content-type', d.headers['content-type']);
            res.send(d.data).end();
        }).catch(next);
    } else {
        let url = `/${req.url.slice('/apisite/'.length + req.params.name.length + 1)}`;
        console.log('[info] proxy for api site', req.params.name, 'url', url);
        res.status(500).send('Internal').end();
    }
});

app.listen(port, () => {
    console.log(`[info] web running on port ${port}`);
});

