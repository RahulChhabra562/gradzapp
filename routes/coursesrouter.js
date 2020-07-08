const express = require('express');
const authenticate = require('../authenticate');
const Courses = require('../models/course');

const bodyParser = require('body-parser');


const courseRouter = express.Router();

courseRouter.use(bodyParser.json());

courseRouter.route('/')
.get((req,res,next) => {
    let category = req.query.category;
    let subcategory = req.query.subcategory;

    if(category && subcategory) {
        Courses.find({category: category, subcategory: subcategory})
        .populate('institution')
        .then((courses) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(courses);
        }, err => next(err))
        .catch((err) => next(err));
    }

    else if(category) {
        Courses.find({category: category})
        .populate('institution')
        .then((courses) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(courses);
        }, err => next(err))
        .catch((err) => next(err));
    }

    else if(subcategory) {
        Courses.find({subcategory: subcategory})
        .populate('institution')
        .then((courses) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(courses);
        }, err => next(err))
        .catch((err) => next(err));
    }

    else{
        Courses.find({})
        .populate('institution')
        .then((courses) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(courses);
        }, err => next(err))
        .catch((err) => next(err));
    }
     
})

.post((req,res,next) => {
    Courses.create(req.body)
    .then((course) => {
        res.statusCode = 201;
        res.setHeader('Content-Type', 'application/json');
        res.json(course);
    }, err => next(err))
    .catch((err) => next(err));
})

.put((req,res,next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /courses');
})

.delete((req,res,next) => {
    Courses.remove()
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
})

courseRouter.route('/:courseId')

.get((req,res,next)=> {
    Courses.findById(req.params.courseId)
    .populate('institution')
    .then((course) => {
        if(!course) {
            const err = new Error('Course with id ' + req.params.courseId + ' not found.');
            err.statusCode = 404;
            return next(err);
        }

        else {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(course);
        }
        

    }, err => next(err))
    .catch((err) => next(err));
})

.post((req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /courses/' + req.params.courseId);
})

.put((req,res,next) => {
    Courses.findByIdAndUpdate(req.params.courseId, {
        $set: req.body
    }, {new: true})
    .populate('institution')
    .then((course) => {
        if(!course) {
            const err = new Error('Course with id ' + req.params.courseId + ' not found.');
            err.statusCode = 404;
            return next(err);
        }
        else {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(course);
        }
        
    }, err => next(err))
    .catch((err) => next(err));
})

.delete((req,res,next) => {
    Courses.findByIdAndRemove(req.params.courseId)
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
});





module.exports = courseRouter