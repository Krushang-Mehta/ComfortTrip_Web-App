import { connectToDatabase } from '../src/lib/db/mongodb.js';
import Car from '../src/models/Car.js';

const initialFleet = [
  {
    brand: 'Maruti Suzuki',
    model: 'Dzire VXi',
    category: 'Sedan',
    seatingCapacity: 4,
    fuelType: 'CNG',
    transmission: 'Manual',
    pricePerKm: 12,
    pricePerDay: 2000,
    images: [{ url: '/Multi-car.png', publicId: 'fleet-dzire' }],
    features: ['Air Conditioning', 'FastTag Enabled', 'Music System', 'Boot Space 378L'],
    status: 'available',
  },
  {
    brand: 'Maruti Suzuki',
    model: 'Ertiga ZXi',
    category: 'SUV',
    seatingCapacity: 6,
    fuelType: 'Petrol',
    transmission: 'Manual',
    pricePerKm: 15,
    pricePerDay: 2800,
    images: [{ url: '/Multi-car.png', publicId: 'fleet-ertiga' }],
    features: ['Rear AC Vents', 'Ample Luggage Space', 'FastTag', 'Airbags'],
    status: 'available',
  },
  {
    brand: 'Toyota',
    model: 'Innova Crysta 2.4 VX',
    category: 'SUV',
    seatingCapacity: 7,
    fuelType: 'Diesel',
    transmission: 'Manual',
    pricePerKm: 19,
    pricePerDay: 3800,
    images: [{ url: '/Car-Banner-3-1.png', publicId: 'fleet-innova' }],
    features: ['Captain Seats', 'Dual Climate AC', 'Roof Carrier', 'Executive Comfort'],
    status: 'available',
  },
  {
    brand: 'Toyota',
    model: 'Fortuner 4x2 Legender',
    category: 'Luxury',
    seatingCapacity: 7,
    fuelType: 'Diesel',
    transmission: 'Automatic',
    pricePerKm: 28,
    pricePerDay: 6500,
    images: [{ url: '/Car-Banner-3-1.png', publicId: 'fleet-fortuner' }],
    features: ['Leather Upholstery', 'Panoramic View', 'VIP Chauffeur', 'JBL Sound'],
    status: 'available',
  },
  {
    brand: 'Force',
    model: 'Urbania Luxury Cruiser',
    category: 'Tempo Traveller',
    seatingCapacity: 16,
    fuelType: 'Diesel',
    transmission: 'Manual',
    pricePerKm: 26,
    pricePerDay: 5500,
    images: [{ url: '/Multi-car.png', publicId: 'fleet-tempo' }],
    features: ['Individual Pushback Seats', 'Individual AC Vents', 'LED TV', 'Separate Luggage Boot'],
    status: 'available',
  },
];

async function seedCars() {
  try {
    await connectToDatabase();
    const existing = await Car.countDocuments();
    if (existing === 0) {
      await Car.insertMany(initialFleet);
      console.log(`[Seed] Successfully seeded ${initialFleet.length} vehicles into database.`);
    } else {
      console.log(`[Seed] Database already has ${existing} vehicles. Skipping duplicate seed.`);
    }
    process.exit(0);
  } catch (err) {
    console.error('[Seed Error]', err);
    process.exit(1);
  }
}

seedCars();
