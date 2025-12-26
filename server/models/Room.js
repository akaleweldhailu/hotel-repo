import mongoose from 'mongoose';

const roomSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please enter room name']
  },
  description: {
    type: String,
    required: [true, 'Please enter room description']
  },
  price: {
    type: Number,
    required: [true, 'Please enter room price']
  },
  maxGuests: {
    type: Number,
    required: true,
    default: 2
  },
  image: {
    type: String,
    default: 'https://images.unsplash.com/photo-1568495248636-6432b97bd949?w=500&auto=format&fit=crop'
  },
  amenities: [String],
  isAvailable: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

const Room = mongoose.model('Room', roomSchema);
export default Room;