const express = require('express');
const authenticate = require('../authenticate');
const Userapplications = require('../models/userapplication');

const bodyParser = require('body-parser');
const user = require('../models/user');



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

userapplicationRouter.route('/:userapplicationId')

.get(authenticate.verifyUser, (req,res,next) => {
    Userapplications.findById(req.params.userapplicationId)
    .then((userapplication) => {
        if(userapplication) {
            if (req.user._id.equals(userapplication.user)) {
                res.statusCode = 200;
                res.setHeader('Content-Type','application/json');
                res.json(userapplication);
            }
    
            else {
                res.statusCode = 401;
                res.end('You can have access to your applications only');
            }
        }
        else {
            const err = new Error('User application not found.')
            err.statusCode = 404;
            return next(err);
        }
    }, err => next(err))
    .catch((err) => next(err));
})

.post(authenticate.verifyUser, (req,res,next) => {
    res.statusCode = 403;
    res.end('Post operation not supported on /userapplications/' + req.params.userapplicationId);
})

.put(authenticate.verifyUser, (req,res,next) => {
    Userapplications.findById(req.params.userapplicationId)
    .then((userapplication) => {
        if(userapplication) {
            if(req.user._id.equals(userapplication.user)) {
                Userapplications.findByIdAndUpdate(req.params.userapplicationId, {
                    $set: req.body
                }, {new: true})
                .then((userapplication) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type','application/json');
                    res.json(userapplication)
                })
                
            }
    
            else {
                res.statusCode = 401;
                res.end('You can edit only your applications')
            }
        }
        else {
            const err = new Error('User application not found.')
            err.statusCode = 404;
            return next(err);
        }
    }, err => next(err))
    .catch((err) => next(err));
})

.delete(authenticate.verifyUser, (req,res,next) => {
    Userapplications.findById(req.params.userapplicationId)
    .then((userapplication) => {
        if(userapplication) {
            if(req.user._id.equals(userapplication.user)) {
                Userapplications.findByIdAndRemove(req.params.userapplicationId)
                .then((resp) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(resp);
                }, (err) => next(err))
                .catch((err) => next(err));
                
            } 
            else {
                res.statusCode = 401;
                res.end('You can delete only your applications')
            }
        }
        else {
            const err = new Error('User application not found.')
            err.statusCode = 404;
            return next(err);
        }
    }, err => next(err))
    .catch((err) => next(err))
})





module.exports = userapplicationRouter;