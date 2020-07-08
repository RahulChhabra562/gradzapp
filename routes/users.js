var express = require('express');
var router = express.Router();
const bodyParser = require('body-parser');
const User = require('../models/user')
const passport = require('passport')
const authenticate = require('../authenticate');
const Userapplications = require('../models/userapplication');

/* GET users listing. */
router.get('/', authenticate.verifyUser, authenticate.verifyAdmin, function(req, res, next) {
    User.find({})
    .then((users) => {
        if(!users) {
            const err = new Error('No users are registered.');
            err.statusCode = 404;
            return next(err);
        }
        else {
            res.statusCode = 200;
            res.setHeader('Content-Type','application/json');
            res.json(users);
        }
    },err => next(err))
    .catch((err) => next(err));
});

router.post('/signup', (req, res, next) => {
  User.register(new User({username: req.body.username}),
      req.body.password, (err, user) => {
          if (err) {
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.json({err: err});
          } else {
              if (req.body.firstname)
                  user.firstname = req.body.firstname;
              if (req.body.lastname)
                  user.lastname = req.body.lastname;
              user.save((err, user) => {
                  if (err) {
                      res.statusCode = 500;
                      res.setHeader('Content-Type', 'application/json');
                      res.json({err: err});
                      return;
                  }
                  passport.authenticate('local')(req, res, () => {
                      res.statusCode = 200;
                      res.setHeader('Content-Type', 'application/json');
                      res.json({success: true, status: 'Registration Successful!'});
                  });
              });
          }
      });
});

router.post('/login', passport.authenticate('local'), (req, res) => {

  const token = authenticate.getToken({_id: req.user._id})
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.json({success: true, token: token, status: 'You are successfully logged in!'});
});

router.get('/:userId', authenticate.verifyUser, (req,res,next) => {
    User.findById(req.params.userId)
    .then((user) => {
        if(!user) {
            const err = new Error('User with id ' + req.params.userId + 'not found.')
            err.statusCode = 404;
            return next(err);
        }

        else {
            res.statusCode = 200;
            res.setHeader('Content-Type','application/json');
            res.json(user);
        }
    }, err => next(err))
    .catch((err) => next(err))
})

router.get('/:userId/applications', authenticate.verifyUser, (req,res,next) => {
    User.findById(req.params.userId)
    .then((user) => {
        if(!user) {
            const err = new Error('User not found with id' + req.params.userId);
            err.statusCode = 404;
            return next(err);
        }

        else {
            Userapplications.find({user: req.params.userId})
            .populate('institution')
            .populate('course')
            .then((userapplications) => {
                if(!userapplications) {
                    const err = new Error('User has not applied in any courses.');
                    err.statusCode = 400;
                    return next(err);
                }

                else {
                    res.statusCode = 200;
                    res.setHeader('Content-Type','application/json');
                    res.json(userapplications);
                }
            }, err => next(err))
            .catch((err) => next(err));
        }
    }, err => next(err))
    .catch((err) => next(err));
})

module.exports = router;
