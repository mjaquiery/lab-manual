const express = require('express')
var history = require('connect-history-api-fallback')
const serveStatic = require("serve-static")
const path = require('path');
app = express();
app.use(history({
    verbose: true
}))
app.use(serveStatic(path.join(__dirname, 'dist')));
const port = process.env.PORT || 80;
app.listen(port);