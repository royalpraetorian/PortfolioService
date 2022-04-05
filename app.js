var express = require('express');
var proxy = require('express-http-proxy');
var bodyParser = require('body-parser');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
const cron = require('node-cron');
const spotifyService = require('./services/spotifyService');
const mongoService = require('./services/mongoService');

var indexRouter = require('./routes/index');
var youtubeRouter = require('./routes/youtube');
var songrequestRouter = require('./routes/songrequest');
var usersRouter = require('./routes/users');
var contactRouter = require('./routes/contact');
const { allowedNodeEnvironmentFlags } = require('process');
const { head } = require('./routes/contact');
const req = require('express/lib/request');

var app = express();
cron.schedule('*/30 * * * *', async function() {
    app.set('playlistCache', await spotifyService.cachePlaylist());
    for(var item in playlistCache)
    {
        mongoService.deleteRecord(item);
    }
});


app.use(logger('dev'));
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());

app.use('/', indexRouter);
app.use('/youtube', youtubeRouter)
app.use('/users', usersRouter);
app.use('/contact', contactRouter);
app.use('/songrequest', songrequestRouter);

module.exports = app;
