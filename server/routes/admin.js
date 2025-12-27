// server/routes/admin.js
import express from 'express';
import User from '../models/User.js';
import Room from '../models/Room.js';
import Booking from '../models/Booking.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

// Get admin dashboard stats
router.get('/stats', protect, admin, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalRooms = await Room.countDocuments();
    const totalBookings = await Booking.countDocuments();
    
    // Get revenue from confirmed bookings
    const revenueData = await Booking.aggregate([
      { $match: { status: 'confirmed' } },
      { $group: { 
        _id: null, 
        totalRevenue: { $sum: '$totalPrice' },
        averageBooking: { $avg: '$totalPrice' }
      }}
    ]);

    res.json({
      success: true,
      data: {
        totalUsers,
        totalRooms,
        totalBookings,
        totalRevenue: revenueData[0]?.totalRevenue || 0,
        averageBooking: revenueData[0]?.averageBooking || 0
      }
    });
  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
});

// Get all users (Admin only)
router.get('/users', protect, admin, async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    res.json({
      success: true,
      data: users
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
});

// Get all bookings (Admin only)
router.get('/bookings', protect, admin, async (req, res) => {
  try {
    const bookings = await Booking.find({})
      .populate('user', 'name email')
      .populate('room')
      .sort('-createdAt');
    
    res.json({
      success: true,
      data: bookings
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
});

// Update booking status (Admin only)
router.put('/bookings/:id/status', protect, admin, async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    booking.status = status;
    await booking.save();
    
    res.json({
      success: true,
      data: booking
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

export default router;