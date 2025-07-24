// Detailed product database with images and affiliate links
const productDatabase = {
  tops: [
    { id: 1, name: 'Cotton T-Shirt', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=200&h=200&fit=crop', price: '$25', affiliate: 'amazon.com/tshirt1' },
    { id: 2, name: 'Wool Sweater', image: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=200&h=200&fit=crop', price: '$45', affiliate: 'amazon.com/sweater1' },
    { id: 3, name: 'Light Jacket', image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=200&h=200&fit=crop', price: '$65', affiliate: 'amazon.com/jacket1' },
    { id: 4, name: 'Tank Top', image: 'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=200&h=200&fit=crop', price: '$20', affiliate: 'amazon.com/tank1' }
  ],
  bottoms: [
    { id: 5, name: 'Denim Jeans', image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=200&h=200&fit=crop', price: '$55', affiliate: 'amazon.com/jeans1' },
    { id: 6, name: 'Summer Shorts', image: 'https://images.unsplash.com/photo-1506629905607-c60bdd05b8e4?w=200&h=200&fit=crop', price: '$30', affiliate: 'amazon.com/shorts1' },
    { id: 7, name: 'Chinos', image: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=200&h=200&fit=crop', price: '$40', affiliate: 'amazon.com/chinos1' },
    { id: 8, name: 'Leggings', image: 'https://images.unsplash.com/photo-1506629905607-c60bdd05b8e4?w=200&h=200&fit=crop', price: '$25', affiliate: 'amazon.com/leggings1' }
  ],
  accessories: [
    { id: 9, name: 'Sunglasses', image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=200&h=200&fit=crop', price: '$35', affiliate: 'amazon.com/sunglasses1' },
    { id: 10, name: 'Baseball Cap', image: 'https://images.unsplash.com/photo-1521369909029-2afed882baee?w=200&h=200&fit=crop', price: '$22', affiliate: 'amazon.com/cap1' },
    { id: 11, name: 'Scarf', image: 'https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?w=200&h=200&fit=crop', price: '$28', affiliate: 'amazon.com/scarf1' },
    { id: 12, name: 'Watch', image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=200&h=200&fit=crop', price: '$89', affiliate: 'amazon.com/watch1' }
  ],
  footwear: [
    { id: 13, name: 'Sneakers', image: 'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=200&h=200&fit=crop', price: '$75', affiliate: 'amazon.com/sneakers1' },
    { id: 14, name: 'Sandals', image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=200&h=200&fit=crop', price: '$45', affiliate: 'amazon.com/sandals1' },
    { id: 15, name: 'Boots', image: 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=200&h=200&fit=crop', price: '$95', affiliate: 'amazon.com/boots1' },
    { id: 16, name: 'Dress Shoes', image: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=200&h=200&fit=crop', price: '$120', affiliate: 'amazon.com/dress1' }
  ]
};

export function getProductsByIds(category, ids) {
  return productDatabase[category].filter(product => ids.includes(product.id));
}

// For catalog, flatten all products
export async function fetchProducts(demographic = 'all') {
  // For now, ignore demographic and return all products
  return [
    ...productDatabase.tops,
    ...productDatabase.bottoms,
    ...productDatabase.accessories,
    ...productDatabase.footwear
  ];
}

export default productDatabase;
