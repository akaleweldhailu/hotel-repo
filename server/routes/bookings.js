import express from 'express';
import Booking from '../models/Booking.js';
import Room from '../models/Room.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Create booking
router.post('/', protect, async (req, res) => {
  try {
    const { roomId, checkIn, checkOut, guests } = req.body;

    // Get room
    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    // Calculate days and total price
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const days = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
    const totalPrice = days * room.price;

    // Create booking
    const booking = await Booking.create({
      user: req.user._id,
      room: roomId,
      checkIn: checkInDate,
      checkOut: checkOutDate,
      guests,
      totalPrice
    });

    // Populate room details
    await booking.populate('room');

    res.status(201).json(booking);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get user's bookings
router.get('/my-bookings', protect, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate('room')
      .sort('-createdAt');
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Cancel booking
router.put('/:id/cancel', protect, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if booking belongs to user
    if (booking.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    booking.status = 'cancelled';
    await booking.save();

    res.json(booking);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;