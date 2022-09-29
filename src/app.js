const express = require('express');
const cookieParser = require('cookie-parser');
//const bodyParser = require('body-parser');
const morgan = require('morgan');
const routes = require('./routes/index.js');
const errorHandler = require('./middlewares/errorHandler');
const setHeaders = require('./middlewares/setHeaders');

require('./db.js');

const server = express();
const {CORS_URL} = process.env;
server.name = 'API';

server.use(express.urlencoded({ extended: true, limit: '50mb' }));
server.use(express.json({ limit: '50mb' }));
//server.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
//server.use(bodyParser.json({ limit: '50mb' }));
server.use(cookieParser());
server.use(morgan('dev'));// Da un Output en la consola por c/ request.

server.use((req, res, next)=>{
    res.header('Access-Control-Allow-Origin', CORS_URL); // update to match the domain you will make the request from
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});
// ------ROUTES
server.use('/api', routes);

// ------CONTROL DE ERRORES - Endeware
server.use(errorHandler);

// ------Landing page
server.use('/', (req, res, next)=>{
  res.send('HECTOR VIDEOGAME APP')
})
module.exports = server;
