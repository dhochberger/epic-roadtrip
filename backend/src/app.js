const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');

require('dotenv').config();
require('dotenv').config({ path: '.env.api' })

require('./auth/passport');

const app = express();

app.use(express.json());
app.use(
    express.urlencoded({
        extended: true,
    })
);

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'
    );
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

if (process.env.NODE_ENV !== 'test') {
    app.use(morgan('combined'));
}
//else app.use(morgan('dev'));

app.use(helmet());
app.use(cors());

app.get('/', (req, res) => {
    res.json({
        message: 'express work',
    });
});

const users = require('./routes/user');
app.use('/api/v1/users', users);

const trips = require('./routes/trip');
app.use('/api/v1/trips', trips);

module.exports = app;
