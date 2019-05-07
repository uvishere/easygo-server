const mongoose = require('mongoose');

const { ObjectId } = mongoose;

const RatingSchema = new mongoose.Schema(
  {
    starRating: {
      type: Number,
      min: 0,
      max: 5,
      required: true
    },
    description: {
      type: String
    },
    createdBy: {
      type: ObjectId,
      ref: 'User',
      required: true
    },
    point: {
      type: ObjectId,
      ref: 'Point',
      required: true
    }
  },
  { timestamps: true }
);

const Rating = mongoose.model('Rating', RatingSchema);

module.exports = Rating;
