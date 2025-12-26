import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Room from './models/Room.js';

// Load environment variables
dotenv.config();

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB Connected Successfully');
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error.message);
    process.exit(1);
  }
};

// Seed database
const seedDatabase = async () => {
  try {
    console.log('🗑️  Clearing existing data...');

    await User.deleteMany();
    await Room.deleteMany();

    console.log('👤 Creating users...');

    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@hotel.com',
      password: 'admin123', // hashed by model
      role: 'admin'
    });

    const user = await User.create({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'user123', // hashed by model
      role: 'user'
    });

    console.log('🏨 Creating rooms...');

    const rooms = [
      {
        name: 'Deluxe Room',
        description: 'Spacious room with king-size bed and city view.',
        price: 150,
        maxGuests: 2,
        image: 'https://images.unsplash.com/photo-1568495248636-6432b97bd949?w=500',
        amenities: ['Free WiFi', 'TV', 'Air Conditioning', 'Mini Bar']
      },
      {
        name: 'Standard Room',
        description: 'Comfortable room with queen-size bed.',
        price: 90,
        maxGuests: 2,
        image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=500',
        amenities: ['Free WiFi', 'TV', 'Air Conditioning']
      },
      {
        name: 'Family Suite',
        description: 'Large suite perfect for families.',
        price: 220,
        maxGuests: 4,
        image: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=500',
        amenities: ['Free WiFi', 'Kitchenette', '2 Bathrooms']
      },
      {
        name: 'Executive Suite',
        description: 'Luxury suite for business travelers.',
        price: 280,
        maxGuests: 2,
        image: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=500',
        amenities: ['Free WiFi', 'Smart TV', 'Work Desk', 'Mini Bar']
      },
      {
        name: 'Economy Room',
        description: 'Affordable room with essential amenities.',
        price: 65,
        maxGuests: 1,
        image: 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=500',
        amenities: ['Free WiFi', 'TV']
      }
    ];

    await Room.insertMany(rooms);

    console.log('✅ Database seeded successfully!');
    console.log('\n📋 Sample Credentials');
    console.log('====================');
    console.log('👑 Admin: admin@hotel.com / admin123');
    console.log('👤 User:  john@example.com / user123');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

// Run seed
await connectDB();
await seedDatabase();
