/**
 * JSON-LD Structured Data Schema for LocalBusiness and AutoRental
 * Targets Rajkot, Gujarat local SEO with geo coordinates, opening hours,
 * contact details, and service regions.
 */

export default function JsonLd() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  const schema = {
    '@context': 'https://schema.org',
    '@type': ['AutoRental', 'LocalBusiness'],
    '@id': `${siteUrl}/#organization`,
    name: 'Comfort Trip Car Rentals',
    alternateName: ['The Comfort Trip', 'Comfort Trip Rajkot', 'Comfort Trip Taxi Service'],
    url: siteUrl,
    logo: `${siteUrl}/Multi-car.png`,
    image: `${siteUrl}/Car-Banner-3-1.png`,
    description:
      "Comfort Trip is Rajkot's top-rated car rental and taxi booking service. We provide affordable outstation cabs, airport transfers, luxury chauffeur rentals, and local taxi services across Rajkot, Somnath, Dwarka, Jamnagar, and Gujarat.",
    telephone: '+919974833330',
    email: 'thecomfort@gmail.com',
    priceRange: '₹₹',
    currenciesAccepted: 'INR',
    paymentAccepted: 'Cash, Credit Card, UPI, Net Banking',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Ramdevpir Chowk, 150 Ft Ring Road, Shyamnagar 1, Gandhigram',
      addressLocality: 'Rajkot',
      addressRegion: 'Gujarat',
      postalCode: '360007',
      addressCountry: 'IN',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 22.3039,
      longitude: 70.8022,
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: [
          'Monday',
          'Tuesday',
          'Wednesday',
          'Thursday',
          'Friday',
          'Saturday',
          'Sunday',
        ],
        opens: '00:00',
        closes: '23:59',
      },
    ],
    areaServed: [
      { '@type': 'City', name: 'Rajkot' },
      { '@type': 'City', name: 'Ahmedabad' },
      { '@type': 'City', name: 'Jamnagar' },
      { '@type': 'City', name: 'Somnath' },
      { '@type': 'City', name: 'Dwarka' },
      { '@type': 'City', name: 'Junagadh' },
      { '@type': 'City', name: 'Porbandar' },
      { '@type': 'City', name: 'Morbi' },
      { '@type': 'City', name: 'Gondal' },
      { '@type': 'State', name: 'Gujarat' },
    ],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Car Rental & Taxi Services',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Local Car Rental & Hourly City Cabs Rajkot',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Rajkot Airport Taxi & Hirasar Airport Transfers',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Outstation Round Trip Cabs (Somnath, Dwarka, Gir)',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'One-Way Intercity Drop Taxi',
          },
        },
      ],
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
