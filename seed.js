const mongoose = require('mongoose');
const Book = require('./models/Book');
const BlogPost = require('./models/BlogPost');
const Review = require('./models/Review');
const GalleryImage = require('./models/GalleryImage');
require('dotenv').config();

const sampleBooks = [
  {
    title: "You Never Cried",
    author: "Nawa Sohail",
    description: "Pace Town is a place of quiet nights, rustling leaves, and stories waiting to be told. Dan, a gentle bookseller and devoted father, has long kept his heart closed. When Rose arrives, carrying secrets of her own, everything begins to change. Together, they find comfort in starlit walks, whispered conversations, and the fragile beauty of second chances.",
    price: 2499,
    coverImageUrl: "/bookhomepage.jpeg",
    status: "Published",
    inventory: 50,
    genre: "Contemporary Fiction",
    year: "2024",
    pages: 329,
    rating: 5.0,
    reviews: 6,
    featured: true,
    isbn: "978-969-696-969-3",
    language: "English",
    readingTime: "7 hours",
    publisher: "Daastan",
    publishDate: "08 Oct 2024",
    fullDescription: "Yet the past is never far behind. When old wounds resurface, their love is tested in ways they never imagined. You Never Cried is a tender, atmospheric novel about love, vulnerability, and the courage it takes to finally let go. Set in the picturesque English countryside, this story explores themes of healing, forgiveness, and the transformative power of love. Through Dan and Rose's journey, readers will discover the beauty of second chances and the strength found in vulnerability."
  }
];

const sampleBlogPosts = [
  {
    title: "Where is my home?",
    content: `Is it just me or is the night really falling?
Is it true that the leaves are really shedding?
I was standing on the shore and I heard someone calling
Me? How could it be when I was beheading?
Soft tears were rolling down my cheeks
As I saw night getting colder and darker
I tried hard to stifle my shrieks
As I knew what the coldness was after
They told me that they loved me
But does love die when you die?
My body was floating on the black sea
Waiting for them to say goodbye
It kills when you have no one
Is it a sin to be alone?
Drowning myself under the scorching sun
I thought about the truth unknown

What if I have no home?
Do my prayers go in vain?
My tears were useless as I mourn
For my heart which was still in pain
They buried me alive in the sand of my sins
In the hallways of regrets roamed my soul
You read my story through scars on my skin
And you still wonder where is my home?`,
    category: "Poetry",
    status: "Published"
  },
  {
    title: "Lost in the Moonlight",
    content: `Lost in the night with a lantern in my hand 
On a winter's night, I stood on a starlit land 
Waiting for stars to twinkle on the charcoal sheet
I remembered the cold night when he held me in the street 
I was burning as I was greeted by millions of stars 
That made me remember how I got these scars
I was silently praying as the darkness was getting cold 
For the love that was no longer mine to hold
You were afraid of the dark, so I became your firefly 
Now that only ash is left of me, you said goodbye
Look at the winter's moon shining on the New Year's night 
Hold my lantern, I want to look for my dying love tonight 
They say lovers meet when it's moonlight
But O my love, it's already midnight
Your love is in my heart, burning like a flame 
Moon is here, but you? You never came`,
    category: "Poetry",
    status: "Published"
  },
  {
    title: "What Was My Fault?",
    content: `It was a lovely night with the wind softly caressing the dried leaves. A nightingale's sweet melody could be heard far away on the hills, soothing the blackened waves in the ocean. The street was dimly lit by a faint lamppost, casting a haunting glow on the dried petals strewn along the pavement. The moon was hiding behind the silver lining of the clouds. A lonely star was twinkling somewhere in the blood-red sky. Or was it burning? 

The window was slightly open, inviting the night's melancholy dance into the room. She was standing in front of the mirror, wearing a red dress that was hugging her knees. Her brownish hair was tied into a ponytail, and her soft smile lit up the room. I caught a glimpse of her in the mirror and our eyes locked. 

Her hazel-colored eyes widened in surprise. How could someone's eyes be deeper than an ocean? I wanted to get lost in those eyes, lose sight of myself, and hold her little finger to protect me from the waves. A soft smile flickered on the corner of her lips as if she had pierced my soul. She raised her eyebrows, and I blushed. My cheeks reddened. I could feel the blood hugging my cheeks. Were they redder than the blood on my knuckles? I shook my head. Not now. I wanted to look at her, lock her in my memory, and visit it when a shadow visits me. That shadow was visiting me more frequently. 

A shiver ran down my spine and I took a deep breath, not letting my anguish carry me away. I just wanted to hold her and feel the soft texture of her skin. Will her touch free me? Or will it make me lose my mind? Why couldn't I have her? I could see her from the corner of my eye, and she was looking more beautiful than ever. Her lips were touching the cup of her hot coffee, and I wanted to trace my finger on it. I wanted to know what it felt like to be held by her.

We all crave warmth. Don't we? 

I looked at my hands. They were bruised, carrying small scars. Are they really small? I looked at my jacket. It was ruffled. What could I do? My hair was a mess. I ran my fingers over the dark stubble of my cheeks. A lump formed in my throat. I tried to swallow it. Swallow everything. I looked at the candle flickering on the floor. The flame was burning. I could smell it. Could she smell it too? Could she see me? Like really see me. 

She was now applying nail paint on her nails. They looked perfect. It was dark and cold. Should I give her the blanket? I looked around but couldn't find it. It was getting colder. The leaves were whispering, and the window opened. 

I shivered. It was so cold. I panicked. She might catch a cold. It must be so difficult for her to be in this small cottage. Where was the blanket? Why couldn't I close the window? Why was it jammed? I rushed to close it. The nail pierced my skin, and blood fell on the floor. I hissed in pain. It was too much. My back was stinging. I was losing my mind. I didn't have time to lose. I have to do something to keep her warm. I looked under the bed to find something. But nothing could be done. There was nothing. I didn't want to look anymore and then a noise startled me. 

I looked up instantly to embrace my biggest fear. I was alone. She was gone. My heart was beating louder than the beating drums. It was in my throat. Something caught my eye. A crack in the mirror. I rushed to see it. It was small but the mirror was no longer the same. I lost it. I couldn't control it anymore. I screamed over my lungs. The moon disappeared. The star burnt. I looked in the mirror. 

There was a shadow with bloodshot eyes. Those eyes were burning. I smashed my hand in the mirror, slicing my finger. I unzipped my jacket and threw it away. Cut my hair. Tried to control my erratic heartbeat. Could she see my scars? Did they scare her? Or did she see the wounds that did not leave any scars? A tear fell into the ocean. It was no longer red. There was so much I wanted to say, so many unsaid things were buried within me. But why couldn't I say them? Why was my tongue tied? Will I always lurk around the dark rooms? Will I only embrace the darkness? I wanted to give her the world, but the world wasn't meant for me.`,
    category: "Short Story",
    status: "Published"
  }
];

const sampleReviews = [
  {
    name: "Dr. Muhammad Hassan",
    email: "m.hassan@email.com",
    rating: 5,
    comment: "As a literature professor, I've read countless books, but 'You Never Cried' stands out for its authentic voice and emotional resonance. Nawa's ability to capture human emotions is extraordinary. This book should be on every literature lover's shelf.",
    bookId: "fallback-1",
    approved: true,
    orderId: "ORD-2024-001",
    orderStatus: "Delivered",
    isVerified: true,
    location: "Karachi, Pakistan",
    profession: "Literature Professor"
  },
  {
    name: "Ayesha Malik",
    email: "ayesha.malik@email.com",
    rating: 5,
    comment: "This book made me cry, laugh, and reflect on life in ways I never expected. The writing is so beautiful and the story so compelling that I read it in one sitting. Nawa has a gift for storytelling that is rare and precious.",
    bookId: "fallback-1",
    approved: true,
    orderId: "ORD-2024-002",
    orderStatus: "Delivered",
    isVerified: true,
    location: "Lahore, Pakistan",
    profession: "Writer"
  },
  {
    name: "Professor Aisha Rahman",
    email: "a.rahman@university.edu",
    rating: 5,
    comment: "From an academic perspective, this work demonstrates exceptional literary merit. The narrative structure, character development, and thematic exploration are all executed with remarkable skill. This is contemporary literature at its finest.",
    bookId: "fallback-1",
    approved: true,
    orderId: "ORD-2024-003",
    orderStatus: "Delivered",
    isVerified: true,
    location: "Islamabad, Pakistan",
    profession: "University Professor"
  }
];

const sampleGalleryImages = [
  {
    title: "Book Signing Event",
    description: "Meeting readers at a book signing event in Karachi",
    src: "/gallery1.jpeg",
    status: "Published"
  },
  {
    title: "Writing Workshop",
    description: "Conducting a creative writing workshop for aspiring authors",
    src: "/gallery2.jpeg",
    status: "Published"
  },
  {
    title: "Literary Festival",
    description: "Participating in the Karachi Literary Festival 2024",
    src: "/gallery3.jpeg",
    status: "Published"
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

    // Clear existing data
    await Book.deleteMany({});
    await BlogPost.deleteMany({});
    await Review.deleteMany({});
    await GalleryImage.deleteMany({});
    console.log('Cleared existing data');

    // Insert sample books
    const insertedBooks = await Book.insertMany(sampleBooks);
    console.log(`Inserted ${insertedBooks.length} books`);

    // Insert sample blog posts
    const insertedBlogPosts = await BlogPost.insertMany(sampleBlogPosts);
    console.log(`Inserted ${insertedBlogPosts.length} blog posts`);

    // Insert sample reviews
    const insertedReviews = await Review.insertMany(sampleReviews);
    console.log(`Inserted ${insertedReviews.length} reviews`);

    // Insert sample gallery images
    const insertedGalleryImages = await GalleryImage.insertMany(sampleGalleryImages);
    console.log(`Inserted ${insertedGalleryImages.length} gallery images`);

    // Display inserted books
    insertedBooks.forEach(book => {
      console.log(`- ${book.title} by ${book.author} (₨${book.price})`);
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