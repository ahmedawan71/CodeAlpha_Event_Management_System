const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const Event = require('./models/Event');
const User = require('./models/User');

dotenv.config();

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        // Clear existing data
        await Event.deleteMany({});
        await User.deleteMany({});
        console.log('Cleared existing data');

        // Create sample user
        const hashedPassword = await bcrypt.hash('123', 10);
        const user = new User({
            email: 'user@gmail.com',
            password: hashedPassword
        });
        await user.save();
        console.log('Created test user: user@gmail.com / 123');

        // Create sample events
        const events = [
            {
                title: 'Tech Conference 2025',
                description: 'Annual technology conference featuring the latest innovations',
                date: new Date('2025-09-15')
            },
            {
                title: 'Web Development Workshop',
                description: 'Hands-on workshop for web developers',
                date: new Date('2025-08-20')
            },
            {
                title: 'AI & Machine Learning Summit',
                description: 'Explore the future of AI and machine learning',
                date: new Date('2025-10-05')
            },
            {
                title: 'Startup Networking Event',
                description: 'Connect with entrepreneurs and investors',
                date: new Date('2025-08-25')
            }
        ];

        await Event.insertMany(events);
        console.log('Created sample events');

        console.log('Seed data created successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1);
    }
};

seedData();