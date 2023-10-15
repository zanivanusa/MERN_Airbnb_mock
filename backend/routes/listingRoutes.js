var express = require('express');
var multer = require('multer');
var upload = multer({ dest: 'public/images/' });

var router = express.Router();
var listingController = require('../controllers/listingController.js');

function requiresLogin(req, res, next) {
  if (req.session && req.session.userId) {
    return next();
  } else {
    console.log("not logged back");
    var err = new Error('You must be logged in to view this page');
    err.status = 401;
    return next(err);
  }
}

router.post('/:id/like', listingController.likeListing);
router.post('/:id/dislike', listingController.dislikeListing);

// GET comments for a specific listing
router.get('/:id/comments', listingController.getListingComments);
router.get('/:ListingId/photos', listingController.getListingPhotos);
router.get('/detailed/:id', listingController.detailedListing);
router.get('/', listingController.list);
router.get('/user/:id', listingController.listByUser);
router.get('/:id', listingController.show);



router.post('/', upload.array('photos'), listingController.create);
router.post('/:id/delete', requiresLogin, listingController.remove);
router.post('/:id/book', requiresLogin, listingController.bookListing);

router.put('/:id', listingController.update);
module.exports = router;
