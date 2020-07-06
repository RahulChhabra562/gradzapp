const express = require('express');
const authenticate = require('../authenticate');
const Institutions = require('../models/institution');

const bodyParser = require('body-parser');


const institutionRouter = express.Router();

institutionRouter.use(bodyParser.json());


institutionRouter.route('/')
.get((req,res,next) => {
    let country = req.query.country;
    if(country){
        Institutions.find({country: country})
        .then((institutions) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(institutions);
        }, err => next(err))
        .catch((err) => next(err));
    }
    else {
        Institutions.find({})
        .then((institutions) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(institutions);
        }, err => next(err))
        .catch((err) => next(err));
    }
})

.post(authenticate.verifyUser, authenticate.verifyAdmin, (req,res,next) => {
    Institutions.create(req.body)
    .then((institution) => {
        res.statusCode = 201;
        res.setHeader('Content-Type', 'application/json');
        res.json(institution);
    }, err => next(err))
    .catch((err) => next(err));
})

.put(authenticate.verifyUser, authenticate.verifyAdmin, (req,res,next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /institutions');
})

.delete( authenticate.verifyUser, authenticate.verifyAdmin, (req,res,next) => {
    Institutions.remove({})
            .then((resp) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(resp);
            }, (err) => next(err))
            .catch((err) => next(err));
});

institutionRouter.route('/:instituteId')

.get((req,res,next) => {
    Institutions.findById(req.params.instituteId)
    .then((institute) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(institute);

    }, err => next(err))
    .catch((err) => next(err));
})

.post(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /institutions/' + req.params.instituteId);
})

.put(authenticate.verifyUser, authenticate.verifyAdmin, (req,res,next) => {
    Institutions.findByIdAndUpdate(req.params.instituteId, {
        $set: req.body
    }, {new: true})
    .then((institute) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(institute);
    }, err => next(err))
    .catch((err) => next(err));
})

.delete(authenticate.verifyUser, authenticate.verifyAdmin, (req,res,next) => {
    Institutions.findByIdAndRemove(req.params.instituteId)
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
});




module.exports = institutionRouter;

