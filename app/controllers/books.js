const Book = require('../models/book');


// CRD (create, read, delete) for books
exports.readBooks = (req, res, next) => {
	Book.find({})
    .populate('author')
    .populate('genre')
    .exec((err, books) => {
      if (err) return res.status(400).json(err);
      res.json(books);
	});
};

exports.createBooks = (req, res, next) => {
  Book.create(req.body, (err, book) => {
    if (err) return res.status(400).json(err);
    res.json({
      message: 'Successfully created', 
      book: book
    });
  });
};

exports.deleteBooks = (req, res, next) => {
  Book.remove({}, (err, book) => {
    if (err) return res.status(400).json(err);
    res.json({
      message: 'Successfully deleted',
      book: book
    });
  });
};


// RUD (read, update, delete) for each book
exports.readBook = (req, res, next) => {
  Book.findOne({_id: req.params.bookId})
    .populate('author')
    .populate('genre')
    .exec((err, book) => {
      if (err) return res.status(400).json(err);
      res.json(book);
    });
};

exports.updateBook = (req, res, next) => {
  Book.findByIdAndUpdate(req.params.bookId, req.body, {new: true}, (err, book) => {
    if (err) return res.status(400).json(err);
    res.json({
      message: 'Successfully updated',
      book: book
    });
  });
};

exports.deleteBook = (req, res, next) => {
  Book.findByIdAndRemove(req.params.bookId, (err, book) => {
    if (err) return res.status(400).json(err);
    res.json({ 
      message: 'Successfully deleted',
      book: book
    });
  })
};