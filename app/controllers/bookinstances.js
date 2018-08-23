const BookInstance = require('../models/bookinstance');


// CRD (create, read, delete) for bookinstances
exports.readBookInstances = (req, res, next) => {
  BookInstance.find({})
    .populate({
      path: 'book',
      model: 'Book',
      populate: [{path: 'author', model: 'Author'}, {path: 'genre', model: 'Genre'}]
    })
    .exec((err, bookinstances) => {
      if (err) return res.status(400).json(err);
      res.json(bookinstances);
    });
};

exports.createBookInstances = (req, res, next) => {
  BookInstance.create(req.body, (err, bookinstance) => {
    if (err) return res.status(400).json(err);
    res.json({
      message: 'Successfully created', 
      bookinstance: bookinstance
    });
  });
};

exports.deleteBookInstances = (req, res, next) => {
  BookInstance.remove({}, (err, ok) => {
    if (err) return res.status(400).json(err);
    res.json({message: 'Successfully deleted'});
  });
};


// RUD (read, update, delete) for each BookInstance
exports.readBookInstance = (req, res, next) => {
  BookInstance.findOne({_id: req.params.bookinstanceId})
    .populate('book')
    .exec((err, bookinstance) => {
      if (err) return res.status(400).json(err);
      res.json(bookinstance);
    });
};

exports.updateBookInstance = (req, res, next) => {
  BookInstance.findByIdAndUpdate(req.params.bookinstanceId, req.body, {new: true}, (err, bookinstance) => {
    if (err) return res.status(400).json(err);
    res.json({
      message: 'Successfully updated',
      bookinstance: bookinstance
    });
  });
};

exports.deleteBookInstance = (req, res, next) => {
  BookInstance.findByIdAndRemove(req.params.bookinstanceId, {new: true}, (err, bookinstance) => {
    if (err) return res.status(400).json(err);
    res.json({ 
      message: "Successfully deleted",
      bookinstance: bookinstance
    });
  })
};