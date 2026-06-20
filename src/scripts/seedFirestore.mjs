/**
 * Firestore Seed Script
 * Run with: npm run seed
 *
 * This script populates your Firestore database with the current portfolio data
 * from tracks.js. It only needs to be run ONCE when setting up the admin panel.
 *
 * BEFORE RUNNING:
 * 1. Create a Firebase project at https://console.firebase.google.com
 * 2. Enable Firestore and Authentication (Email/Password)
 * 3. Create an admin user in Authentication
 * 4. Copy your Firebase config to the .env file
 * 5. Run: npm run seed
 */

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc, addDoc, serverTimestamp } from 'firebase/firestore';
import { config } from 'dotenv';

// Load env vars — in Node we need dotenv since VITE_ prefixes are only for Vite
// We'll read them manually from .env
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = resolve(__dirname, '../../.env');

let envVars = {};
try {
  const envContent = readFileSync(envPath, 'utf-8');
  envContent.split('\n').forEach(line => {
    const [key, ...valueParts] = line.split('=');
    if (key && valueParts.length) {
      envVars[key.trim()] = valueParts.join('=').trim();
    }
  });
} catch (err) {
  console.error('❌ Could not read .env file. Create one from .env.example first.');
  process.exit(1);
}

const firebaseConfig = {
  apiKey: envVars.VITE_FIREBASE_API_KEY,
  authDomain: envVars.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: envVars.VITE_FIREBASE_PROJECT_ID,
  storageBucket: envVars.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: envVars.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: envVars.VITE_FIREBASE_APP_ID,
};

if (!firebaseConfig.projectId || firebaseConfig.projectId === 'your-project-id') {
  console.error('❌ Firebase config not set. Update your .env file with real Firebase values.');
  process.exit(1);
}

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ========== DATA FROM tracks.js ==========

const youtubeVideos = [
  { id: 'Rppzop-SUy4', title: 'Arpudhamaana Naamame', artist: 'Benny John Joseph', category: 'original' },
  { id: 'XYZawVrF3z4', title: 'Vetkapattupovathillai', artist: 'Zac Robert', category: 'original' },
  { id: '8IqgN-P8-y0', title: 'Paaduvaen En Yesuvai', artist: 'Messiah Dasan', category: 'original' },
  { id: 'Ut-Z__gnqXo', title: 'Hosanna', artist: 'Abikumar', category: 'original' },
  { id: 'ztA2OHbKuhk', title: 'MASIHA', artist: 'Merlyn Salvadi', category: 'original' },
  { id: 'Ip9O1_buM2E', title: 'Aasmaan', artist: 'The Non Violinist Project', category: 'featured' },
  { id: 'IJUl1JqAlxE', title: 'Kaathiru', artist: 'Abikumar', category: 'original' },
  { id: 'EdImPdsXJUc', title: 'Sthuthincheda', artist: 'Merge Music', category: 'original' },
  { id: '3156_SWKB0k', title: 'Melana Naamame', artist: 'Freddy John Samuel', category: 'original' },
  { id: 'E-KysKHJ6Kw', title: 'Thooyar Neer Endrum', artist: 'Zac Robert', category: 'original' },
  { id: 'vAVJkIsyGTM', title: 'Thedi Poguthe', artist: 'Shravan Sridhar', category: 'featured' },
  { id: 'SFOowRQEj3o', title: 'BHAAGO', artist: 'Merlyn Salvadi', category: 'original' },
  { id: '7Moh-N2j6_I', title: 'Maruvalenu / Nee Balidhanamu', artist: 'Merge Music', category: 'original' },
  { id: '-hXYTjnXExM', title: 'Lovely Lord', artist: 'CRC | Petra Cover', category: 'cover' },
  { id: 'ZQ_mHFdORxk', title: 'En Nilalaaneerae', artist: 'Messiah Dasan', category: 'original' },
  { id: 'wIT5EjP6deg', title: 'En Parigaari (Healer)', artist: 'Hallelujah Tower', category: 'original' },
  { id: 'sxw14GszsXs', title: 'Ratchagar Yesu Piranthar', artist: 'Christmas Song', category: 'original' },
  { id: '68YxWgyHYDU', title: 'Solven Yesu', artist: 'Zac Robert', category: 'cover' },
  { id: 'mYsHEKeZ1nM', title: 'Enna Thavam Seithaen', artist: 'Angelin Blessey', category: 'original' },
  { id: '_5JfSO43QCM', title: 'Shubhavela', artist: 'Merge Music', category: 'original' },
  { id: 'e1wZPZcflfA', title: 'ELSHADDAI', artist: 'Freddy John Samuel', category: 'original' },
  { id: '78rLQG1N30k', title: 'Chattan Telugu', artist: 'Merge Music', category: 'original' },
  { id: '6AHXzg_WsEE', title: 'Everybody x Sa Re Ga Me', artist: 'The Non Violinist Project', category: 'featured' },
  { id: 'dwBXAv61_hQ', title: 'Saadhyame', artist: 'Merge Music', category: 'original' },
  { id: 'KWGA-SkhD8c', title: 'The Ultimate Bollywood Retro', artist: 'The Non Violinist Project', category: 'featured' },
];

const spotifyTracks = [
  { id: '1SEM8M8RDyH8Qt5E5eTwMy', title: 'Tere Saath' },
  { id: '6oAD86UAm9STeojYu2HhGp', title: 'Ennai Yetrarulum Yesuve' },
  { id: '2CFMpOyaT4MCAXzKONIvrI', title: 'Arpanithaen' },
];

const testimonials = [
  { name: 'Zac Robert', role: 'Worship Leader & Artist', text: 'Amos is the kind of musician who lifts every song to the next level. His keyboard work and production on our tracks was nothing short of incredible.', stars: 5 },
  { name: 'Merlyn Salvadi', role: 'Independent Artist', text: 'Working with Amos on MASIHA and BHAAGO was a game-changer. He understood the vision instantly and brought creative brilliance to every session.', stars: 5 },
  { name: 'Musik Hub Student', role: 'Keyboard Student', text: 'I learned more in 3 months with Amos than in years of self-learning. His patience and structured approach made music theory actually fun.', stars: 5 },
  { name: 'Freddy John Samuel', role: 'Gospel Artist', text: "Amos's production on Melana Naamame and ELSHADDAI was top-tier. He combines technical skill with genuine musical emotion.", stars: 5 },
];

const latestNews = [
  { date: 'Recent Release', title: 'New Spotify Single — "Tere Saath"', description: 'Latest single now streaming on all platforms. A heartfelt worship track produced and performed by Amos Frank.', type: 'release' },
  { date: 'Featured Video', title: 'Arpudhamaana Naamame', description: 'Official music video with Benny John Joseph, featuring full production and keyboard arrangement by Amos.', type: 'video' },
  { date: 'Admissions Open', title: 'Musik Hub — Join Now', description: 'Keyboard, Bass Guitar & Music Production classes now open for enrollment. Join the next batch of aspiring musicians.', type: 'announcement' },
];

// ========== SEED FUNCTIONS ==========

async function seedCollection(collectionName, items) {
  console.log(`\n📦 Seeding ${collectionName}...`);
  for (let i = 0; i < items.length; i++) {
    await addDoc(collection(db, collectionName), {
      ...items[i],
      order: i + 1,
      createdAt: serverTimestamp(),
    });
    process.stdout.write(`  ✓ ${items[i].title || items[i].name || `Item ${i + 1}`}\n`);
  }
  console.log(`  ✅ ${items.length} items added to ${collectionName}`);
}

async function seedSingleDoc(collectionName, docId, data) {
  console.log(`\n📦 Seeding ${collectionName}/${docId}...`);
  await setDoc(doc(db, collectionName, docId), {
    ...data,
    updatedAt: serverTimestamp(),
  });
  console.log(`  ✅ Document saved`);
}

async function main() {
  console.log('🚀 Starting Firestore seed...\n');
  console.log(`  Project: ${firebaseConfig.projectId}`);

  try {
    // Seed collections
    await seedCollection('youtube_videos', youtubeVideos);
    await seedCollection('spotify_tracks', spotifyTracks);
    await seedCollection('testimonials', testimonials);
    await seedCollection('latest_news', latestNews);

    // Seed single documents
    await seedSingleDoc('artist_info', 'profile', {
      name: 'Amos Frank',
      tagline: 'Teacher, Guitarist & Music Producer',
      role: 'Teacher',
      roles: ['Music Producer', 'Performer', 'Teacher'],
      bio: `A music producer, performer, and educator with over 20 years of musical experience. I started my journey at the age of 10 and have been performing professionally for over 11 years across a wide range of genres.\n\nI specialize in keyboard, bass guitar, and music production, and I'm passionate about creating music that connects—whether it's on stage, in the studio, or in the classroom.`,
      bioExtended: `Inspired by artists like Snarky Puppy, Cory Henry, Jacob Collier, Bruno Mars, and Israel Houghton, my style blends groove, harmony, and modern production.\n\nThrough my music school, Musik Hub, I help students grow into confident, creative musicians while also working with artists and clients to bring their musical ideas to life.`,
      heroPhoto: '/amos-hero.jpg',
      aboutPhoto: '/amos-stage-bw.jpg',
      bassPhoto: '/amos-bass.jpg',
      keysPhoto: '/amos-keys.jpg',
    });

    await seedSingleDoc('site_settings', 'general', {
      featuredVideoId: 'Rppzop-SUy4',
      tracks: 29,
      videos: 26,
      spotifyTracks: 3,
      yearsPerforming: 11,
      yearsActive: 20,
      email: 'iamamosfrank.v@gmail.com',
      phone: '+91 7708913686',
      location: 'Coimbatore, Tamil Nadu, India',
      instagram: 'https://www.instagram.com/amosfrank.wav',
      musikHub: 'https://www.instagram.com/musikhub.in',
    });

    console.log('\n\n🎉 Seed complete! All data has been written to Firestore.');
    console.log('   You can now run the admin dashboard and see your data.\n');
    process.exit(0);
  } catch (err) {
    console.error('\n❌ Seed failed:', err.message);
    process.exit(1);
  }
}

main();
