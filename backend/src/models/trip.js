const mongoose = require('../database');

//let User = require('./user');
const User = require('./user').schema;

const EventSchema = mongoose.Schema({
  date: { type: String, required: false }, // date de l'event

  name: { type: String, required: true }, // Name
  description: { type: String, required: false },
  position: { type: {
    lat: {
      type: Number,
      required: true
    },
    lon: {
      type: Number,
      required: true
    }
  }, required: true },
  photo: {type: String, required: false},
  website: { type: String, required: false },
  type: {type: String, required: false}
}, {timestamps: true});

const Event = mongoose.model("Event", EventSchema);

const RoadPointSchema = mongoose.Schema({
    event: { type: [EventSchema], required: true}, // Liste d'événements

    country: { type: String, required: false },
    city: { type: String, required: false },
    postalcode: { type: Number, required: false },
    position: { type: {
      lat: {
        type: Number,
        required: true
      },
      lon: {
        type: Number,
        required: true
      }
    }, required: true }
}, {timestamps: true});

const RoadPoint = mongoose.model("RoadPoint", RoadPointSchema);

const TripSchema = mongoose.Schema({
    itinerary: {type: [RoadPointSchema], required: true},//, required: true},
    creator: {type: User, index: false, unique: false},
    is_public: {type: Boolean, required: false, default: false},
    sharingcode: {type: String},
}, {timestamps: true});

TripSchema.post('save', function (doc, next) {
  doc.sharingcode = doc._id
  next();
});

const Trip = mongoose.model('Trip', TripSchema);

module.exports = { Trip, RoadPoint, Event }