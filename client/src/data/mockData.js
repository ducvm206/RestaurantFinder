// client/src/data/mockData.js 
// Mock data cho restaurants và dishes

export const mockRestaurants = [
  {
    id: 1,
    name: "諭吉ラーメン",
    nameEn: "Yukichi Ramen",
    rating: 4.7,
    distance: 1.2,
    priceRange: "$$",
    services: ["dine_in", "takeout"],
    style: ["casual"],
    cuisine: "japanese",
    image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=300&fit=crop",
    address: "ハノイ工科大学",
    isOpen: true
  },
  {
    id: 2,
    name: "TOKYO Deli SUSHI",
    nameEn: "Tokyo Deli Sushi",
    rating: 4.7,
    distance: 0.8,
    priceRange: "$$$",
    services: ["dine_in", "online_payment"],
    style: ["formal", "family_friendly"],
    cuisine: "japanese",
    image: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400&h=300&fit=crop",
    address: "寿司・弁当・和食",
    isOpen: true
  },
  {
    id: 3,
    name: "Osaka Ramen",
    nameEn: "Osaka Ramen",
    rating: 4.5,
    distance: 2.1,
    priceRange: "$$",
    services: ["dine_in", "takeout"],
    style: ["casual"],
    cuisine: "japanese",
    image: "https://images.unsplash.com/photo-1557872943-16a5ac26437e?w=400&h=300&fit=crop",
    address: "ラーメン・和食",
    isOpen: true
  },
  {
    id: 4,
    name: "成長町ラーメン",
    nameEn: "Seicho Machi Ramen",
    rating: 4.9,
    distance: 1.5,
    priceRange: "$$",
    services: ["dine_in", "takeout", "online_payment"],
    style: ["casual", "family_friendly"],
    cuisine: "japanese",
    image: "https://images.unsplash.com/photo-1617093727343-374698b1b08d?w=400&h=300&fit=crop",
    address: "ハノイ市",
    isOpen: true
  },
  {
    id: 5,
    name: "諸吉ラーメン",
    nameEn: "Morokichi Ramen",
    rating: 4.3,
    distance: 3.2,
    priceRange: "$",
    services: ["dine_in", "takeout"],
    style: ["casual"],
    cuisine: "japanese",
    image: "https://images.unsplash.com/photo-1623341214825-9f4f963727da?w=400&h=300&fit=crop",
    address: "ハノイ市",
    isOpen: true
  },
  {
    id: 6,
    name: "ハトヤマ",
    nameEn: "Hatoyama",
    rating: 4.7,
    distance: 2.8,
    priceRange: "$$$",
    services: ["dine_in", "has_deals"],
    style: ["formal"],
    cuisine: "japanese",
    image: "https://images.unsplash.com/photo-1580822184713-fc5400e7fe10?w=400&h=300&fit=crop",
    address: "ハノイ市",
    isOpen: true
  },
  {
    id: 7,
    name: "Banh Mi Hanoi",
    nameEn: "Banh Mi Hanoi",
    rating: 4.6,
    distance: 0.5,
    priceRange: "$",
    services: ["takeout"],
    style: ["casual"],
    cuisine: "vietnamese",
    image: "https://images.unsplash.com/photo-1598511726623-d2e9996892f0?w=400&h=300&fit=crop",
    address: "ハノイ旧市街",
    isOpen: true
  },
  {
    id: 8,
    name: "天ぷら亭",
    nameEn: "Tempura Tei",
    rating: 4.8,
    distance: 3.5,
    priceRange: "$$$",
    services: ["dine_in", "online_payment"],
    style: ["formal", "family_friendly"],
    cuisine: "japanese",
    image: "https://images.unsplash.com/photo-1590301157890-4810ed352733?w=400&h=300&fit=crop",
    address: "ハノイ市",
    isOpen: false
  },
  {
    id: 9,
    name: "寿司バー",
    nameEn: "Sushi Bar",
    rating: 4.4,
    distance: 1.8,
    priceRange: "$$",
    services: ["dine_in", "has_deals"],
    style: ["casual", "drinking_party"],
    cuisine: "japanese",
    image: "https://images.unsplash.com/photo-1583623025817-d180a2221d0a?w=400&h=300&fit=crop",
    address: "ハノイ市",
    isOpen: true
  },
  {
    id: 10,
    name: "居酒屋サクラ",
    nameEn: "Izakaya Sakura",
    rating: 4.5,
    distance: 2.3,
    priceRange: "$$",
    services: ["dine_in", "online_payment"],
    style: ["drinking_party"],
    cuisine: "japanese",
    image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=300&fit=crop",
    address: "ハノイ市",
    isOpen: true
  },
  {
    id: 11,
    name: "うどん屋",
    nameEn: "Udon-ya",
    rating: 4.2,
    distance: 4.1,
    priceRange: "$",
    services: ["dine_in", "takeout"],
    style: ["casual"],
    cuisine: "japanese",
    image: "https://images.unsplash.com/photo-1618841557871-b4664fbf0cb3?w=400&h=300&fit=crop",
    address: "ハノイ市",
    isOpen: true
  },
  {
    id: 12,
    name: "焼肉レストラン",
    nameEn: "Yakiniku Restaurant",
    rating: 4.6,
    distance: 2.7,
    priceRange: "$$$",
    services: ["dine_in", "has_deals"],
    style: ["family_friendly", "drinking_party"],
    cuisine: "japanese",
    image: "https://images.unsplash.com/photo-1608877907149-79c19c1593b0?w=400&h=300&fit=crop",
    address: "ハノイ市",
    isOpen: true
  },
  {
    id: 13,
    name: "カレーハウス",
    nameEn: "Curry House",
    rating: 4.3,
    distance: 1.9,
    priceRange: "$$",
    services: ["dine_in", "takeout", "online_payment"],
    style: ["casual", "family_friendly"],
    cuisine: "japanese",
    image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&h=300&fit=crop",
    address: "ハノイ市",
    isOpen: true
  },
  {
    id: 14,
    name: "そば処",
    nameEn: "Soba Dokoro",
    rating: 4.7,
    distance: 3.8,
    priceRange: "$$",
    services: ["dine_in"],
    style: ["formal"],
    cuisine: "japanese",
    image: "https://images.unsplash.com/photo-1519984388953-d2406bc725e1?w=400&h=300&fit=crop",
    address: "ハノイ市",
    isOpen: false
  },
  {
    id: 15,
    name: "お好み焼き屋",
    nameEn: "Okonomiyaki-ya",
    rating: 4.4,
    distance: 2.6,
    priceRange: "$$",
    services: ["dine_in", "takeout"],
    style: ["casual", "family_friendly"],
    cuisine: "japanese",
    image: "https://images.unsplash.com/photo-1626804475297-41608ea09aeb?w=400&h=300&fit=crop",
    address: "ハノイ市",
    isOpen: true
  },
  {
    id: 16,
    name: "とんかつ専門店",
    nameEn: "Tonkatsu Senmonten",
    rating: 4.8,
    distance: 1.3,
    priceRange: "$$",
    services: ["dine_in", "takeout", "online_payment"],
    style: ["casual"],
    cuisine: "japanese",
    image: "https://images.unsplash.com/photo-1628294895950-9805252327bc?w=400&h=300&fit=crop",
    address: "ハノイ市",
    isOpen: true
  },
  {
    id: 17,
    name: "回転寿司",
    nameEn: "Kaiten Sushi",
    rating: 4.1,
    distance: 5.2,
    priceRange: "$",
    services: ["dine_in"],
    style: ["casual", "family_friendly"],
    cuisine: "japanese",
    image: "https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?w=400&h=300&fit=crop",
    address: "ハノイ市",
    isOpen: true
  },
  {
    id: 18,
    name: "鉄板焼き",
    nameEn: "Teppanyaki",
    rating: 4.9,
    distance: 3.4,
    priceRange: "$$$",
    services: ["dine_in", "online_payment", "has_deals"],
    style: ["formal", "family_friendly"],
    cuisine: "japanese",
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop",
    address: "ハノイ市",
    isOpen: true
  },
  {
    id: 19,
    name: "丼ぶり専門店",
    nameEn: "Donburi Senmonten",
    rating: 4.3,
    distance: 2.2,
    priceRange: "$",
    services: ["dine_in", "takeout"],
    style: ["casual"],
    cuisine: "japanese",
    image: "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=400&h=300&fit=crop",
    address: "ハノイ市",
    isOpen: true
  },
  {
    id: 20,
    name: "和食レストラン花",
    nameEn: "Washoku Restaurant Hana",
    rating: 4.6,
    distance: 1.7,
    priceRange: "$$",
    services: ["dine_in", "online_payment"],
    style: ["formal", "family_friendly"],
    cuisine: "japanese",
    image: "https://images.unsplash.com/photo-1580822184713-fc5400e7fe10?w=400&h=300&fit=crop",
    address: "ハノイ市",
    isOpen: true
  }
];

export const mockDishes = [
  {
    id: 1,
    name: "豚骨ラーメン",
    nameEn: "Tonkotsu Ramen",
    restaurantId: 1,
    restaurantName: "諭吉ラーメン",
    price: 520,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=300&h=200&fit=crop",
    isPopular: true
  },
  {
    id: 2,
    name: "味噌ラーメン",
    nameEn: "Miso Ramen",
    restaurantId: 3,
    restaurantName: "Osaka Ramen",
    price: 630,
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1557872943-16a5ac26437e?w=300&h=200&fit=crop",
    isPopular: true
  },
  {
    id: 3,
    name: "塩出しラーメン",
    nameEn: "Shiodashi Ramen",
    restaurantId: 4,
    restaurantName: "成長町ラーメン",
    price: 500,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1617093727343-374698b1b08d?w=300&h=200&fit=crop",
    isPopular: true
  },
  {
    id: 4,
    name: "坦々ラーメン",
    nameEn: "Tantan Ramen",
    restaurantId: 5,
    restaurantName: "諸吉ラーメン",
    price: 690,
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1623341214825-9f4f963727da?w=300&h=200&fit=crop",
    isPopular: true
  },
  {
    id: 5,
    name: "サーモン寿司",
    nameEn: "Salmon Sushi",
    restaurantId: 2,
    restaurantName: "TOKYO Deli SUSHI",
    price: 450,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=300&h=200&fit=crop",
    isPopular: true
  },
  {
    id: 6,
    name: "マグロ寿司",
    nameEn: "Tuna Sushi",
    restaurantId: 2,
    restaurantName: "TOKYO Deli SUSHI",
    price: 550,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1583623025817-d180a2221d0a?w=300&h=200&fit=crop",
    isPopular: true
  },
  {
    id: 7,
    name: "バインミー",
    nameEn: "Banh Mi",
    restaurantId: 7,
    restaurantName: "Banh Mi Hanoi",
    price: 180,
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1598511726623-d2e9996892f0?w=300&h=200&fit=crop",
    isPopular: true
  },
  {
    id: 8,
    name: "天ぷら盛り合わせ",
    nameEn: "Tempura Assortment",
    restaurantId: 8,
    restaurantName: "天ぷら亭",
    price: 980,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1590301157890-4810ed352733?w=300&h=200&fit=crop",
    isPopular: false
  },
  {
    id: 9,
    name: "焼き鳥セット",
    nameEn: "Yakitori Set",
    restaurantId: 10,
    restaurantName: "居酒屋サクラ",
    price: 420,
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=300&h=200&fit=crop",
    isPopular: false
  },
  {
    id: 10,
    name: "カツカレー",
    nameEn: "Katsu Curry",
    restaurantId: 13,
    restaurantName: "カレーハウス",
    price: 580,
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=300&h=200&fit=crop",
    isPopular: false
  },
  {
    id: 11,
    name: "とんかつ定食",
    nameEn: "Tonkatsu Set",
    restaurantId: 16,
    restaurantName: "とんかつ専門店",
    price: 720,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1628294895950-9805252327bc?w=300&h=200&fit=crop",
    isPopular: false
  },
  {
    id: 12,
    name: "親子丼",
    nameEn: "Oyakodon",
    restaurantId: 19,
    restaurantName: "丼ぶり専門店",
    price: 380,
    rating: 4.4,
    image: "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=300&h=200&fit=crop",
    isPopular: false
  },
  {
    id: 13,
    name: "お好み焼き",
    nameEn: "Okonomiyaki",
    restaurantId: 15,
    restaurantName: "お好み焼き屋",
    price: 520,
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1626804475297-41608ea09aeb?w=300&h=200&fit=crop",
    isPopular: false
  },
  {
    id: 14,
    name: "ざるそば",
    nameEn: "Zaru Soba",
    restaurantId: 14,
    restaurantName: "そば処",
    price: 450,
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1519984388953-d2406bc725e1?w=300&h=200&fit=crop",
    isPopular: false
  },
  {
    id: 15,
    name: "海鮮丼",
    nameEn: "Kaisen-don",
    restaurantId: 20,
    restaurantName: "和食レストラン花",
    price: 890,
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1580822184713-fc5400e7fe10?w=300&h=200&fit=crop",
    isPopular: false
  }
];

// Recent search keywords
export const mockRecentKeywords = [
  "バインミー",
  "寿司",
  "ラーメン",
  "天ぷら"
];

// Filter options
export const filterOptions = {
  services: [
    { value: "店内飲食", label: "店内飲食" },
    { value: "持ち帰り", label: "持ち帰り" },
    { value: "特典あり", label: "特典あり" },
    { value: "オンライン決済可", label: "オンライン決済可" }
  ],
  cuisines: [
    { value: "日本料理", label: "日本料理" },
    { value: "ベトナム料理", label: "ベトナム料理" }
  ],
  distances: [
    { value: "< 2", label: "< 2 km" },
    { value: "2-6", label: "2 - 6 km" },
    { value: "> 6", label: "> 6 km" }
  ],
  priceRanges: [
    { value: "cheap", label: "$" },
    { value: "moderate", label: "$$" },
    { value: "expensive", label: "$$$" }
  ],
  styles: [
    { value: "フォーマル", label: "フォーマル" },
    { value: "飲み会", label: "飲み会" },
    { value: "家族向け", label: "家族向け" },
    { value: "カジュアル", label: "カジュアル" }
  ]
};