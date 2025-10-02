const mongoose = require('mongoose');
const Book = require('./models/Book');
require('dotenv').config();

const sampleBooks = [
  {
    title: "You Never Cried",
    author: "Nawa Sohail",
    description: "Pace Town is a place of quiet nights, rustling leaves, and stories waiting to be told. Dan, a gentle bookseller and devoted father, has long kept his heart closed. When Rose arrives, carrying secrets of her own, everything begins to change.",
    price: 24.99,
    coverImageUrl: "/bookhomepage.jpeg",
    status: "Published",
    inventory: 50,
    genre: "Fiction",
    year: "2024",
    pages: 329,
    rating: 5.0,
    reviews: 6
  },
  {
    title: "The Art of Storytelling",
    author: "Nawa Sohail",
    description: "A comprehensive guide to crafting compelling narratives that captivate readers and leave lasting impressions.",
    price: 19.99,
    coverImageUrl: "/bookhomepage.jpeg",
    status: "Published",
    inventory: 30,
    genre: "Non-Fiction",
    year: "2023",
    pages: 256,
    rating: 4.8,
    reviews: 12
  }
];

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/writer-website', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('Connected to MongoDB');

    // Clear existing books
    await Book.deleteMany({});
    console.log('Cleared existing books');

    // Insert sample books
    const insertedBooks = await Book.insertMany(sampleBooks);
    console.log(`Inserted ${insertedBooks.length} books`);

    // Display inserted books
    insertedBooks.forEach(book => {
      console.log(`- ${book.title} by ${book.author} ($${book.price})`);
    });

    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

seedDatabase();