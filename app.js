const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const http = require('http');
require('dotenv').config()

const app = express();
const origin = [
    'http://localhost:4200'
]

app.use(cors(
    {
        origin: origin,
        credentials: true
    }
));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.get("/", (req, res) => {
    res.status(200).send("Programming Examination API V 0.1").end();
});

app.post("/triangle", (req, res) => {
    try {

        if (!req.body.base) {
            return res.status(404).send("base not define").end();
        }

        if (!req.body.height) {
            return res.status(404).send("height not define").end();
        }

        const triangle = 0.5 * parseFloat(req.body.base) * parseFloat(req.body.height);
        return res.status(200).send({
            area: triangle
        }).end();
    } catch (error) {
        return res.status(500).send(error).end();
    }
});

app.post("/verify-citizen-id", (req, res) => {
    try {
        if (!req.body.citizen_id) {
            return res.status(404).send({
                success: false,
                error_code: '001',
                error_msg: 'citizen_id require'
            }).end();
        }

        const citizen_id = (req.body.citizen_id).toString();
        let sum = 0,
            total = 0,
            digi = 13;

        for (let i = 0; i < 12; i++) {
            sum = sum + (parseInt(citizen_id[i]) * digi);
            digi--;
        }
        total = (11 - (sum % 11)) % 10;

        if (total !== parseInt(citizen_id[12])) {
            return res.status(404).send({
                success: false,
                error_code: '001',
                error_msg: 'citizen_id invalid'
            }).end();
        }

        return res.status(200).send({
            success: true,
            error_code: '200',
            error_msg: ''
        }).end();
    } catch (error) {
        return res.status(500).send(error).end();
    }
});

var server = http.createServer(app);
server.listen(8120)
