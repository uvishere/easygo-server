const mongoose = require('mongoose');

const { ObjectId } = mongoose.SchemaTypes;

const PointSchema = new mongoose.Schema(
  {
    pointType: {
      type: String,
      enum: [
        'toilet',
        'parking',
        'gaps',
        'crossings',
        'obstructions',
        'pathways'
      ],
      required: true
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        required: true
      },
      coordinates: {
        type: [Number],
        required: true
      }
    },
    description: {
      type: String
    },
    createdBy: {
      type: ObjectId,
      ref: 'User',
      required: true
    },
    ratings: {
      type: [ObjectId],
      ref: 'Rating'
    }
  },
  { timestamps: true }
);

PointSchema.index({ location: '2dsphere' });

const Point = mongoose.model('Point', PointSchema);

module.exports = Point;
