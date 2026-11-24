// Mock catalogue shaped like the WooCommerce Store API (/wp-json/wc/store/v1/products).
// Prices are strings in minor units, exactly as Woo returns them. Swap for live data via wooAdapter.js.
const cat = (id, slug, name) => ({ id, slug, name });
const CATS = {
  running: cat(11, 'running', 'Running'),
  training: cat(12, 'training', 'Training'),
  team: cat(13, 'team-sports', 'Team Sports'),
  footwear: cat(14, 'footwear', 'Footwear'),
  accessories: cat(15, 'accessories', 'Accessories'),
};
const price = (regular, sale) => ({
  price: String(sale ?? regular),
  regular_price: String(regular),
  sale_price: String(sale ?? regular),
  currency_code: 'USD',
  currency_minor_unit: 2,
});
const SHOE = ['7', '8', '9', '10', '11', '12'];
const APP = ['S', 'M', 'L', 'XL'];
const ONE = ['One size'];

export const PRODUCTS = [
  { id: 101, name: 'Velocity Pro Runner', slug: 'velocity-pro-runner', sku: 'ETS-RUN-101', art: 'shoe', sport: 'running', categories: [CATS.running, CATS.footwear], tags: ['running shoes', 'road', 'carbon'], prices: price(16000, 12900), badge: 'New', average_rating: 4.8, review_count: 412, colors: ['volt', 'pink', 'cyan', 'onyx', 'white'], sizes: SHOE },
  { id: 102, name: 'Apex Gym Trainer', slug: 'apex-gym-trainer', sku: 'ETS-TRN-102', art: 'shoe', sport: 'gym', categories: [CATS.training, CATS.footwear], tags: ['gym', 'lifting', 'trainer'], prices: price(14000), badge: '', average_rating: 4.6, review_count: 188, colors: ['onyx', 'blue', 'purple', 'orange', 'white'], sizes: SHOE },
  { id: 103, name: 'Court Flight Basketball Shoe', slug: 'court-flight', sku: 'ETS-FTW-103', art: 'shoe', sport: 'basketball', categories: [CATS.team, CATS.footwear], tags: ['basketball', 'court', 'high-top'], prices: price(17500, 14900), badge: 'Best seller', average_rating: 4.7, review_count: 301, colors: ['red', 'yellow', 'onyx', 'teal', 'white'], sizes: SHOE },
  { id: 104, name: 'Stride Aero Tee', slug: 'stride-aero-tee', sku: 'ETS-RUN-104', art: 'shirt', sport: 'running', categories: [CATS.running], tags: ['running', 'apparel', 'tee'], prices: price(4500, 3400), badge: '', average_rating: 4.5, review_count: 260, colors: ['volt', 'pink', 'blue', 'orange', 'onyx'], sizes: APP },
  { id: 105, name: 'Pitch Master Match Football', slug: 'pitch-master-football', sku: 'ETS-TEAM-105', art: 'football', sport: 'football', categories: [CATS.team], tags: ['football', 'soccer', 'match ball'], prices: price(3800), badge: 'Pro pick', average_rating: 4.7, review_count: 530, colors: ['white', 'volt', 'orange', 'pink', 'cyan'], sizes: ['Size 5', 'Size 4'] },
  { id: 106, name: 'Court Elite Indoor/Outdoor Basketball', slug: 'court-elite-basketball', sku: 'ETS-TEAM-106', art: 'basketball', sport: 'basketball', categories: [CATS.team], tags: ['basketball', 'court', 'ball'], prices: price(5500, 4400), badge: '', average_rating: 4.7, review_count: 301, colors: ['orange', 'blue', 'purple', 'onyx'], sizes: ['Size 7', 'Size 6'] },
  { id: 107, name: 'Rally Carbon Tennis Racket', slug: 'rally-carbon-racket', sku: 'ETS-TEAM-107', art: 'racket', sport: 'tennis', categories: [CATS.team], tags: ['tennis', 'racket', 'carbon'], prices: price(22000, 17900), badge: '-19%', average_rating: 4.8, review_count: 96, colors: ['blue', 'pink', 'volt', 'onyx'], sizes: ['Grip 2', 'Grip 3', 'Grip 4'] },
  { id: 108, name: 'Iron Grip Dumbbell Set', slug: 'iron-grip-dumbbell-set', sku: 'ETS-TRN-108', art: 'dumbbell', sport: 'gym', categories: [CATS.training], tags: ['gym', 'dumbbell', 'strength'], prices: price(12000, 9600), badge: 'Top rated', average_rating: 4.9, review_count: 97, colors: ['onyx', 'red', 'cyan', 'orange'], sizes: ['10 kg', '15 kg', '20 kg'] },
  { id: 109, name: 'HydroCharge Bottle 750ml', slug: 'hydrocharge-bottle', sku: 'ETS-ACC-109', art: 'bottle', sport: 'running', categories: [CATS.accessories], tags: ['hydration', 'bottle', 'gym'], prices: price(2400), badge: '', average_rating: 4.4, review_count: 640, colors: ['volt', 'pink', 'cyan', 'purple', 'onyx'], sizes: ONE },
  { id: 110, name: 'Stadium Training Shorts', slug: 'stadium-training-shorts', sku: 'ETS-TRN-110', art: 'shorts', sport: 'gym', categories: [CATS.training], tags: ['shorts', 'training', 'apparel'], prices: price(5200, 3900), badge: '', average_rating: 4.5, review_count: 142, colors: ['onyx', 'green', 'blue', 'pink', 'volt'], sizes: APP },
  { id: 111, name: 'Phantom Willow Cricket Bat', slug: 'phantom-cricket-bat', sku: 'ETS-TEAM-111', art: 'bat', sport: 'cricket', categories: [CATS.team], tags: ['cricket', 'bat', 'willow'], prices: price(15000, 11900), badge: '', average_rating: 4.6, review_count: 74, colors: ['onyx', 'red', 'blue', 'green', 'orange'], sizes: ['SH', 'Harrow', 'Short handle'] },
  { id: 112, name: 'Velocity Run Pack 12L', slug: 'velocity-run-pack', sku: 'ETS-ACC-112', art: 'bag', sport: 'running', categories: [CATS.accessories, CATS.running], tags: ['bag', 'pack', 'hydration'], prices: price(6800, 5500), badge: '', average_rating: 4.5, review_count: 133, colors: ['onyx', 'volt', 'blue', 'pink', 'teal'], sizes: ONE },
];

export const CATEGORY_TABS = [
  { key: 'all', label: 'All' },
  { key: 'running', label: 'Running' },
  { key: 'training', label: 'Training' },
  { key: 'team-sports', label: 'Team Sports' },
  { key: 'footwear', label: 'Footwear' },
  { key: 'accessories', label: 'Accessories' },
];

export const SPORTS = [
  { key: 'football', label: 'Football', art: 'football', color: 'white' },
  { key: 'basketball', label: 'Basketball', art: 'basketball', color: 'orange' },
  { key: 'running', label: 'Running', art: 'shoe', color: 'volt' },
  { key: 'gym', label: 'Gym', art: 'dumbbell', color: 'onyx' },
  { key: 'tennis', label: 'Tennis', art: 'racket', color: 'blue' },
  { key: 'cricket', label: 'Cricket', art: 'bat', color: 'onyx' },
];

export const MEGA = [
  { key: 'running', label: 'Running', cat: 'running', links: ['Road shoes', 'Trail shoes', 'Tees & tanks', 'Packs & hydration'], feature: 'Velocity Pro Runner' },
  { key: 'training', label: 'Training', cat: 'training', links: ['Gym trainers', 'Shorts', 'Strength gear', 'Recovery'], feature: 'Iron Grip Dumbbell Set' },
  { key: 'team', label: 'Team Sports', cat: 'team-sports', links: ['Football', 'Basketball', 'Tennis', 'Cricket'], feature: 'Pitch Master Match Football' },
  { key: 'footwear', label: 'Footwear', cat: 'footwear', links: ['Running', 'Training', 'Basketball', 'New arrivals'], feature: 'Court Flight Basketball Shoe' },
  { key: 'accessories', label: 'Accessories', cat: 'accessories', links: ['Bottles', 'Bags & packs', 'Grips & tape', 'Socks'], feature: 'HydroCharge Bottle 750ml' },
];

export const REGIONS = [
  { code: 'BD', name: 'Bangladesh', currency: 'BDT', rate: 122, locale: 'en-BD', flag: 'BD' },
  { code: 'US', name: 'United States', currency: 'USD', rate: 1, locale: 'en-US', flag: 'US' },
  { code: 'UK', name: 'United Kingdom', currency: 'GBP', rate: 0.79, locale: 'en-GB', flag: 'UK' },
  { code: 'EU', name: 'Europe', currency: 'EUR', rate: 0.92, locale: 'de-DE', flag: 'EU' },
];

export const COLOR_HEX = { volt: '#D4FF00', onyx: '#0F172A', white: '#F1F5F9', blue: '#2563EB', red: '#EF4444', orange: '#F97316', pink: '#EC4899', cyan: '#06B6D4', purple: '#7C3AED', yellow: '#FACC15', teal: '#14B8A6', green: '#22C55E' };
export const PROMOS = { VOLT10: 0.1, TOTAL15: 0.15, WELCOME10: 0.1 };
export const FREE_SHIPPING_MINOR = 10000; // USD 100.00
export const FLAT_SHIPPING_MINOR = 899;
