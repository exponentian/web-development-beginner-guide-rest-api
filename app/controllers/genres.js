const Genre = require('../models/genre');


// CRD (create, read, delete) for genres
exports.readGenres = (req, res, next) => {
  Genre.find({}, (err, genres) => {
    if (err) return res.status(400).json(err);
    res.json(genres);
  });
};

exports.createGenres = (req, res, next) => {
  if (req.body.name === undefined) {
    return res.status(400).json({ message: 'name required' });
  }

  Genre.create(req.body, (err, genre) => {
    if (err) return res.status(400).json(err);
    res.json({
      message: 'Successfully created', 
      genre: genre
    });
  });
};

exports.deleteGenres = (req, res, next) => {
  Genre.remove({}, (err, genre) => {
    if (err) return res.status(400).json(err);
    res.json({
      message: 'Successfully deleted',
      genre: genre
    });
  });
};


// RUD (read, update, delete) for each genre
exports.readGenre = (req, res, next) => {
  Genre.findOne({_id: req.params.genreId}, (err, genre) => {
    if (err) return res.status(400).json(err);
    res.json(genre);
  });
};

exports.updateGenre = (req, res, next) => {
  if (req.body === undefined || Object.keys(req.body).length < 1) {
    return res.status(400).json({ message: "some input required" });
  }

  Genre.findByIdAndUpdate(req.params.genreId, req.body, {new: true}, (err, genre) => {
    if (err) return res.status(400).json(err);
    res.json({
      message: 'Successfully updated',
      genre: genre
    });
  });
};

exports.deleteGenre = (req, res, next) => {
  Genre.findByIdAndRemove(req.params.genreId, (err, genre) => {
    if (err) return res.status(400).json(err);
    res.json({ 
      message: "Successfully deleted",
      genre: genre
    });
  })
};