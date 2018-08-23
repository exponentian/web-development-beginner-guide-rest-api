const Author = require('../models/author');


// CRD (create, read, delete) for authors
exports.readAuthors = (req, res, next) => {
  Author.find({}, (err, Authors) => {
    if (err) return res.status(400).json(err);
    res.json(Authors);
  });
};

exports.createAuthors = (req, res, next) => {
  Author.create(req.body, (err, author) => {
    if (err) return res.status(400).json(err);
    res.json({
      message: 'Successfully created', 
      author: author
    });
  });
};

exports.deleteAuthors = (req, res, next) => {
  Author.remove({}, (err, author) => {
    if (err) return res.status(400).json(err);
    res.json({
      message: 'Successfully deleted',
      author: author
    });
  });
};


// RUD (read, update, delete) for each author
exports.readAuthor = (req, res, next) => {
  Author.findOne({_id: req.params.authorId}, (err, author) => {
    if (err) return res.status(400).json(err);
    res.json(author);
  });
};

exports.updateAuthor = (req, res, next) => {
  Author.findByIdAndUpdate(req.params.authorId, req.body, {new: true}, (err, author) => {
    if (err) return res.status(400).json(err);
    res.json({
      message: 'Successfully updated',
      author: author
    });
  });
};

exports.deleteAuthor = (req, res, next) => {
  Author.findByIdAndRemove(req.params.authorId, (err, author) => {
    if (err) return res.status(400).json(err);
    res.json({ 
      message: "Successfully deleted",
      author: author
    });
  })
};