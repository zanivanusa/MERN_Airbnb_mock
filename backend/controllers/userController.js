var UserModel = require('../models/userModel.js');
var PhotoModel = require('../models/photoModel.js');
var ListingModel = require('../models/listingModel.js');

/**
 * userController.js
 *
 * @description :: Server-side logic for managing users.
 */
module.exports = {

    /**
     * userController.list()
     */
    list: function (req, res) {
        UserModel.find(function (err, users) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting user.',
                    error: err
                });
            }

            return res.json(users);
        });
    },

    /**
     * userController.show()
     */
    show: function (req, res) {
        var id = req.params.id;
        console.log("!user show");

        UserModel.findOne({_id: id}, function (err, user) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting user.',
                    error: err
                });
            }

            if (!user) {
                return res.status(404).json({
                    message: 'No such user'
                });
            }

            return res.json(user);
        });
    },

    /**
     * userController.create()
     */
    create: function (req, res) {
        var user = new UserModel({
			username : req.body.username,
			password : req.body.password,
			email : req.body.email
        });

        user.save(function (err, user) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when creating user',
                    error: err
                });
            }

            return res.status(201).json(user);
            //return res.redirect('/users/login');
        });
    },

    /**
     * userController.update()
     */
    update: function (req, res) {
        var id = req.params.id;

        UserModel.findOne({_id: id}, function (err, user) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting user',
                    error: err
                });
            }

            if (!user) {
                return res.status(404).json({
                    message: 'No such user'
                });
            }

            user.username = req.body.username ? req.body.username : user.username;
			user.password = req.body.password ? req.body.password : user.password;
			user.email = req.body.email ? req.body.email : user.email;
			
            user.save(function (err, user) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating user.',
                        error: err
                    });
                }

                return res.json(user);
            });
        });
    },

    /**
     * userController.remove()
     */
    remove: function (req, res) {
        var id = req.params.id;

        UserModel.findByIdAndRemove(id, function (err, user) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the user.',
                    error: err
                });
            }

            return res.status(204).json();
        });
    },

    showRegister: function(req, res){
        res.render('user/register');
    },

    showLogin: function(req, res){
        res.render('user/login');
    },

    login: function(req, res, next){
        UserModel.authenticate(req.body.username, req.body.password, function(err, user){
            if(err || !user){
                var err = new Error('Wrong username or paassword');
                err.status = 401;
                return next(err);
            }
            req.session.userId = user._id;
            //res.redirect('/users/profile');
            return res.json(user);
        });
    },

    profile: function(req, res, next) {
        UserModel.findById(req.session.userId)
          .exec(function(error, user) {
            if (error) {
              return next(error);
            } else {
              if (user === null) {
                var err = new Error('Not authorized, go back!');
                err.status = 400;
                return next(err);
              } else {
                // Fetch all posts by the user
                PhotoModel.find({ postedBy: req.session.userId })
                  .exec(function(error, posts) {
                    if (error) {
                      return next(error);
                    } else {
                      // Calculate the total number of likes for the user's posts
                      let totalLikes = 0;
                      for (const post of posts) {
                        totalLikes += post.likes;
                      }
      
                      let totaldisLikes = 0;
                      for (const post of posts) {
                        totaldisLikes += post.dislikes;
                      }
      
                      // Fetch listings posted by the user
                      ListingModel.find({ user: req.session.userId }).populate('photos')
                        .exec(function(error, listingsPosted) {
                          if (error) {
                            return next(error);
                          } else {
                            // Fetch listings booked by the user
                            ListingModel.find({ bookedBy: req.session.userId }).populate('photos')
                              .exec(function(error, listingsBooked) {
                                if (error) {
                                  return next(error);
                                } else {
                                  // Create an object with the user profile data, total likes, listings posted, and listings booked
                                  const profileData = {
                                    username: user.username,
                                    email: user.email,
                                    totalPosts: posts.length,
                                    totalLikes: totalLikes,
                                    totaldisLikes: totaldisLikes,
                                    listingsPosted: listingsPosted,
                                    listingsBooked: listingsBooked
                                  };
      
                                  return res.json(profileData);
                                }
                              });
                          }
                        });
                    }
                  });
              }
            }
          });
      },
      

    logout: function(req, res, next){
        if(req.session){
            req.session.destroy(function(err){
                if(err){
                    return next(err);
                } else{
                    //return res.redirect('/');
                    return res.status(201).json({});
                }
            });
        }
    }
};
