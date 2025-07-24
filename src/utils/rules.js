// Advanced outfit suggestion rules using product IDs
export function getOutfitSuggestion(weather) {
  const { temp, condition, humidity, windSpeed } = weather;
  let outfit = { tops: [], bottoms: [], accessories: [], footwear: [] };

  if (temp < 10) {
    outfit.tops = [2, 3]; // Wool Sweater, Light Jacket
    outfit.bottoms = [5, 7]; // Jeans, Chinos
    outfit.accessories = [11, 12]; // Scarf, Watch
    outfit.footwear = [15]; // Boots
  } else if (temp < 20) {
    outfit.tops = [1, 3]; // T-Shirt, Light Jacket
    outfit.bottoms = [5, 7]; // Jeans, Chinos
    outfit.accessories = [10, 12]; // Cap, Watch
    outfit.footwear = [13]; // Sneakers
  } else if (temp < 30) {
    outfit.tops = [1]; // T-Shirt
    outfit.bottoms = [6, 7]; // Shorts, Chinos
    outfit.accessories = [9, 10]; // Sunglasses, Cap
    outfit.footwear = [13, 14]; // Sneakers, Sandals
  } else {
    outfit.tops = [4]; // Tank Top
    outfit.bottoms = [6, 8]; // Shorts, Leggings
    outfit.accessories = [9]; // Sunglasses
    outfit.footwear = [14]; // Sandals
  }

  if (condition === 'rainy') {
    outfit.accessories.push(11); // Add scarf/protection
    outfit.footwear = [15]; // Boots for rain
  }

  return outfit;
}
