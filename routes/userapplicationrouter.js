const express = require('express');
const authenticate = require('../authenticate');
const Userapplications = require('../models/userapplication');

const bodyParser = require('body-parser');



const userapplicationRouter = express.Router();

userapplicationRouter.use(bodyParser.json());


userapplicationRouter.route('/')

.get(authenticate.verifyUser, (req,res,next) => {
    Userapplications.find({user: req.user._id})
    .populate('institution')
    .populate('course')
    .populate('user')
    .then((userapplications) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(userapplications);
    }, err => next(err))
    .catch((err) => next(err));
})

.post(authenticate.verifyUser, (req,res,next) => {
    req.body.user = req.user._id
    Userapplications.create(req.body)
    .then((userapplication) => {
        res.statusCode = 201;
        res.setHeader('Content-Type','application/json');
        res.json(userapplication);
    }, err => next(err))
    .catch((err) => next(err));
})

.put(authenticate.verifyUser, (req,res,next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /userapplications');
})

.delete(authenticate.verifyUser, (req,res,next) => {
    Userapplications.remove({user: req.user._id})
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
    
})





module.exports = userapplicationRouter;