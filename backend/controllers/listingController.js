var Listing = require('../models/listingModel.js');
var User = require('../models/userModel');
var Comment = require('../models/commentModel');
var Photo = require('../models/photoModel');

module.exports = {
  dislikeListing: async function (req, res) {
    try {
      var listingId = req.params.id;
      var userId = req.session.userId;
      const listing = await Listing.findOne({ _id: listingId });

      if (!listing) {
        return res.status(404).json({
          message: 'No such listing',
        });
      }

      if (!userId) {
        return res.status(401).json({
          message: 'User is not logged in',
        });
      }

      var dislikedIndex = listing.dislikedBy.indexOf(userId);

      if (dislikedIndex === -1) {
        listing.dislikedBy.push(userId);
        listing.dislikes += 1;
      } else {
        listing.dislikedBy.splice(dislikedIndex, 1);
        listing.dislikes -= 1;
      }

      const updatedListing = await listing.save();

      // Update the dislikedListings field of the user who disliked the listing
      const user = await User.findByIdAndUpdate(userId, {
        $addToSet: { dislikedListings: updatedListing._id },
      });

      return res.json(updatedListing);
    } catch (err) {
      return res.status(500).json({
        message: 'Error when updating listing or user.',
        error: err,
      });
    }
  },

  getListingComments: function (req, res) {
    try {
      const listingId = req.params.id;

      // Fetch the comments for the specified listingId
      Comment.find({ listing: listingId })
        .then((comments) => {
          console.log(comments);
          res.json(comments);
        })
        .catch((error) => {
          console.error('Error fetching comments:', error);
          res.status(500).json({ error: 'Failed to fetch comments' });
        });
    } catch (error) {
      console.error('Error fetching comments:', error);
      res.status(500).json({ error: 'Failed to fetch comments' });
    }
  },

  likeListing: async function (req, res) {
    try {
      var listingId = req.params.id;
      var userId = req.session.userId;
      const listing = await Listing.findOne({ _id: listingId });

      if (!listing) {
        return res.status(404).json({
          message: 'No such listing',
        });
      }

      if (!userId) {
        return res.status(401).json({
          message: 'User is not logged in',
        });
      }

      var likedIndex = listing.likedBy.indexOf(userId);

      if (likedIndex === -1) {
        listing.likedBy.push(userId);
        listing.likes += 1;
      } else {
        listing.likedBy.splice(likedIndex, 1);
        listing.likes -= 1;
      }

      const updatedListing = await listing.save();

      // Update the likedListings field of the user who liked the listing
      const user = await User.findByIdAndUpdate(userId, {
        $addToSet: { likedListings: updatedListing._id },
      });

      return res.json(updatedListing);
    } catch (err) {
      return res.status(500).json({
        message: 'Error when updating listing or user.',
        error: err,
      });
    }
  },

  detailedListing: async function (req, res) {
    try {
      const listingId = req.params.id;
      var userId = req.session.userId;

      // Fetch the detailed listing information
      const listing = await Listing.findById(listingId).populate('photos').exec();

      if (!listing) {
        return res.status(404).json({ message: 'Listing not found' });
      }

      // Fetch the user information of the person who posted the listing
      const postedByUser = await User.findById(listing.postedBy);

      if (!postedByUser) {
        return res.status(404).json({ message: 'User not found' });
      }
      // Prepare the response object with the listing and user information
      const detailedListing = {
        listing: {
          _id: listing._id,
          title: listing.title,
          description: listing.description,
          postedBy: userId,
          price: listing.price,
          location: listing.location,
          photos: listing.photos.map((photo) => ({
            _id: photo._id,
            photoPath: photo.photoPath,
          })),
        },
        user: {
          _id: postedByUser._id,
          username: postedByUser.username,
          email: postedByUser.email,
        },
      };

      return res.status(200).json(detailedListing);
    } catch (error) {
      return res.status(500).json({
        message: 'Error when fetching detailed listing',
        error: error.message,
      });
    }
  },


  bookListing: async function (req, res) {

    try {
      var listingId = req.params.id;
      var userId = req.session.userId;
  
      const listing = await Listing.findOne({ _id: listingId });
  
      if (!listing) {
        return res.status(404).json({
          message: 'No such listing',
        });
      }
  
      if (!userId) {
        return res.status(401).json({
          message: 'User is not logged in',
        });
      }
  
      // Set the 'isBooked' value of the listing to true
      listing.isBooked = true;
      listing.bookedBy = req.session.userId;
  
      const updatedListing = await listing.save();
  
      return res.json({ message: 'Listing booked successfully' });
    } catch (err) {
      return res.status(500).json({
        message: 'Error when booking the listing.',
        error: err,
      });
    }
  },
  


  getListingPhotos: async function (req, res) {
    var ListingId = req.params.ListingId;

    Listing.find({ _id: ListingId })
      .populate('photos') // Populate the 'photos' field
      .exec(function (err, listing) {
        if (err) {
          return res.status(500).json({
            message: 'Error when getting listing.',
            error: err,
          });
        }
  
        if (!listing) {
          return res.status(404).json({
            message: 'Listing not found.',
          });
        }

        const photos = listing.photos; // Extract the photos from the listing object
        return res.json(photos);
      });
  },
  
   

  list: function (req, res) {

    Listing.find().populate('photos').sort('price')
      .exec(function (err, listings) {
        console.log(err);
        if (err) {
          return res.status(500).json({
            message: 'Error when getting listings.',
            error: err,
          
          });
        }
        return res.json(listings);
      });
  },

  listByUser: function (req, res) {
    var userId = req.params.userId;
  
    Listing.find({ postedBy: userId })
      .sort({ publishTime: -1 })
      .populate('postedBy')
     // .populate('photos')
      .exec(function (err, listings) {
        if (err) {
          return res.status(500).json({
            message: 'Error when getting user listings.',
            error: err,
          });
        }
  
        return res.json(listings);
      });
  },

  show: function (req, res) {
    var id = req.params.id;
    console.log("showing");
    Listing.findOne({ _id: id })
    .populate('postedBy')
    .populate('photos') // Populate the photos array
    .exec(function (err, listing) {
      if (err) {
          console.log("showing error");
          return res.status(500).json({
            message: 'Error when getting listing.',
            error: err,
          });
        }

        if (!listing) {
          return res.status(404).json({
            message: 'No such listing',
          });
        }

        return res.json(listing);
      });
  },


// ...
create: async function (req, res) {
  try {
    const savedPhotos = [];

    // Check if there are any uploaded files
    if (req.files) {
      if (!Array.isArray(req.files)) {
        // If there is only one file, convert it to an array for consistency
        req.files = [req.files];
      }

      for (const file of req.files) {
        // Save the uploaded photo and retrieve its ID
        const savedPhoto = new Photo({
          photoPath: file.filename,
          postedBy: req.session.userId,
          OnListing: null,
        });
        const savedPhotoResult = await savedPhoto.save();
        savedPhotos.push(savedPhotoResult._id);
      }
    }
    const listing = new Listing({
      title: req.body.title,
      description: req.body.description,
      price: req.body.price,
      location: req.body.location,
      photos: savedPhotos,
      postedBy: req.body.postedBy,
    });

    for (const savedPhotoId of savedPhotos) {
      // Update with reference to the listing object
      await Photo.findByIdAndUpdate(savedPhotoId, { OnListing: listing._id });
    }

    listing.save(function (err, listing) {
      if (err) {
        console.log("what");
        return res.status(500).json({
          message: 'Error when creating listing',
          error: err,
        });
      }

      return res.status(201).json(listing);
    });
  } catch (error) {
    console.log("ha?");
    return res.status(500).json({
      message: 'Error when creating listing',
      error: error.message,
    });
  }
},

  
  

  update: function (req, res) {
    var id = req.params.id;

    Listing.findOne({ _id: id }, function (err, listing) {
      if (err) {
        return res.status(500).json({
          message: 'Error when getting listing',
          error: err,
        });
      }

      if (!listing) {
        return res.status(404).json({
          message: 'No such listing',
        });
      }

      listing.title = req.body.title ? req.body.title : listing.title;
      listing.description = req.body.description
        ? req.body.description
        : listing.description;
      listing.price = req.body.price ? req.body.price : listing.price;
      listing.location = req.body.location
        ? req.body.location
        : listing.location;
      listing.photos = req.body.photos ? req.body.photos : listing.photos;
      // Update other fields as needed

      listing.save(function (err, listing) {
        if (err) {
          return res.status(500).json({
            message: 'Error when updating listing.',
            error: err,
          });
        }

        return res.json(listing);
      });
    });
  },

  remove: function (req, res) {
    var id = req.params.id;

    console.log(id);
    Listing.findByIdAndRemove(id, function (err, listing) {
      if (err) {
        return res.status(500).json({
          message: 'Error when deleting the listing.',
          error: err,
        });
      }

      return res.status(204).json();
    });
  },

  publish: function (req, res) {
    return res.render('listing/publish');
  },
};
