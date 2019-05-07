'use strict';

const express = require('express');
const mongoose = require('mongoose');

const Point = require('../models/point');
const Rating = require('../models/rating');

const { getPoint } = require('../utils/point');
const { sendResponse } = require('../utils/response');

const router = new express.Router();

/**
 * Post obstacle
 * req: {
 *    body: {
 *      type: string,
 *      description?: string,
 *      location: [longitude<number>, latitude<number>]
 *   }
 * }
 */
router.post('/point', async (req, res) => {
  // TODO: implement permit? / validator
  const response = sendResponse(res);
  const obstacle = new Point({
    ...req.body,
    createdBy: req.user.id,
    location: getPoint(req.body.location)
  });

  try {
    await obstacle.save();
    response({ message: 'Obstacle created successfully!', data: obstacle });
  } catch (e) {
    // TODO: message from error itself, it has clear description on the problem
    response({
      type: 'client_error',
      message: 'Error while processing input',
      error: e
    });
  }
});

/**
 * Get points, search points based on location
 * req: {
 *   query: {
 *     location: [longitude<number>, latitude<number>],
 *     distance: number // in meters
 *   }
 * }
 */
// TODO: rating aggregation
router.get('/point', async (req, res) => {
  const response = sendResponse(res);

  const { query } = req;
  let obstacles;
  const { location: rawLocation, distance: rawDistance } = query;
  if (rawLocation && rawDistance && Array.isArray(query.location)) {
    const location = rawLocation.map(str => parseFloat(str));
    const distance = parseInt(rawLocation);

    obstacles = await Point.find({
      location: {
        $near: {
          $maxDistance: distance,
          $geometry: getPoint(location)
        }
      }
    });
  } else {
    obstacles = await Point.aggregate([
      {
        $lookup: {
          from: 'ratings',
          localField: 'ratings',
          foreignField: '_id',
          as: 'ratings'
        }
      },
      {}
    ]);
  }
  response({
    type: obstacles.length ? 'success' : 'not_found',
    message: obstacles.length
      ? 'Point fetched successfully!'
      : 'Points not found',
    ...(obstacles.length && { data: obstacles })
  });
});

router.get('/point/:id', async (req, res) => {
  const isIdValid = mongoose.Types.ObjectId.isValid(req.params.id);

  let point;
  if (isIdValid)
    point = await Point.aggregate([
      {
        $match: {
          _id: mongoose.Types.ObjectId(req.params.id)
        }
      },
      {
        $lookup: {
          from: 'ratings',
          localField: 'ratings',
          foreignField: '_id',
          as: 'ratings'
        }
      }
    ]);
  sendResponse(res)({
    type: isIdValid && point ? 'success' : 'not_found',
    message:
      isIdValid && point
        ? 'Point fetched successfully!'
        : 'Point not found. Please provide valid id.',
    ...(point && { data: point })
  });
});

router.put('/point/:id', async (req, res) => {
  const response = sendResponse(res);
  const isIdValid = mongoose.Types.ObjectId.isValid(req.params.id);

  let point;
  if (isIdValid) {
    point = await Point.findByIdAndUpdate(req.params.id, req.body, {
      lean: true,
      new: true
    });
  }
  response({
    type: isIdValid ? 'success' : 'not_found',
    message: isIdValid ? 'Point updated successfully.' : 'Point not found.',
    ...(isIdValid && { data: point })
  });
});

router.delete('/point/:id', async (req, res) => {
  const response = sendResponse(res);
  const isIdValid = mongoose.Types.ObjectId.isValid(req.params.id);
  if (isIdValid) {
    await Point.findByIdAndDelete(req.params.id, { strict: true });
  }
  response({
    type: isIdValid ? 'success' : 'not_found',
    message: isIdValid ? 'Point deleted successfully.' : 'Point not found.'
  });
});

router.post('/point/:id/rating', async (req, res) => {
  const response = sendResponse(res);
  const isIdValid = mongoose.Types.ObjectId.isValid(req.params.id);
  let point;
  if (isIdValid) point = await Point.findById(req.params.id);
  if (!isIdValid || !point) {
    return response({
      type: 'not_found',
      message: 'Point not found.'
    });
  }

  const rating = new Rating({
    ...req.body,
    createdBy: req.user._id,
    point: req.params.id
  });
  try {
    await rating.save();
    point.ratings.push(rating._id);
    point.save();
  } catch (e) {
    response({
      type: 'client_error',
      message: 'Error while processing input',
      error: e
    });
  }

  response({
    type: 'success',
    message: 'Rating added successfully.',
    data: rating
  });
});

module.exports = router;
