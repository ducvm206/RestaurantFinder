import noodle from "../assets/noodle.jpg";
import banh_my from "../assets/banh_my.jpg";
import sushi from "../assets/sushi.jpg";

import deliLogo from "../assets/tokyo_deli.jpg";
import ramenLogo from "../assets/tokyo_deli.jpg";

import ava_1 from "../assets/avatar_1.jpg";

export const stores = [
  {
    id: 1,
    name: "TOKYO Deli SUSHI",
    jp_name: "トーキョーデリ",
    description: "Fresh sushi and bento dishes prepared daily.",
    categories: ["寿司", "弁当", "和食"],
    rating: 4.7,
    distance_km: 1.2,
    address: "123 Nguyễn Trãi, Hà Nội",
    phone: "0909-123-456",
    open_hours: "09:00 - 22:00",
    logo: deliLogo,
    images: [deliLogo, deliLogo, deliLogo],

    // ✔ menu cleaned + correct images
    menu: [
      { id: 1, name: "サーモン寿司", price: 8, image: sushi },
      { id: 2, name: "マグロ寿司", price: 9, image: sushi },
      { id: 3, name: "バインミー", price: 5, image: banh_my },
      { id: 4, name: "豚骨ラーメン", price: 10, image: noodle },
      { id: 5, name: "味噌ラーメン", price: 11, image: noodle },
      { id: 6, name: "餃子", price: 4, image: banh_my },
    ],

    reviews: [
      {
        id: 1,
        user: "Alice",
        avatar: ava_1,
        rating: 5,
        comment:
          "料理がどれも本当においしくて、大満足でした。特に〇〇は味のバランスが素晴らしく、素材の良さがしっかり感じられました。",
        date: "2024-11-10",
      },
    ],
  },

  {
    id: 2,
    name: "Osaka Ramen",
    jp_name: "大阪ラーメン",
    description: "Rich broth ramen prepared with handmade noodles.",
    categories: ["ラーメン", "和食"],
    rating: 4.5,
    distance_km: 0.8,
    address: "45 Kim Mã, Hà Nội",
    phone: "0988-555-222",
    open_hours: "10:00 - 21:00",
    logo: ramenLogo,
    images: [ramenLogo, ramenLogo, ramenLogo],

    // ✔ removed duplicates + correct images
    menu: [
      { id: 1, name: "豚骨ラーメン", price: 10, image: noodle },
      { id: 2, name: "味噌ラーメン", price: 11, image: noodle },
      { id: 3, name: "餃子", price: 4, image: banh_my },
    ],

    reviews: [
      {
        id: 1,
        user: "Alice",
        avatar: ava_1,
        rating: 5,
        comment:
          "スープが濃厚で本当に美味しかったです。また来ます！",
        date: "2024-11-10",
      },
    ],
  },
];

// -----------------------------------------------------
// FOOD LIST
// -----------------------------------------------------

export const foodlist = [
  {
    id: 1,
    name: "サーモン寿司",
    price: 8,
    image: sushi,
    description: "Fresh salmon sushi with premium rice",
  },
  {
    id: 2,
    name: "マグロ寿司",
    price: 9,
    image: sushi,
    description: "Delicious tuna sushi for sushi lovers",
  },
  {
    id: 3,
    name: "バインミー",
    price: 5,
    image: banh_my,
    description: "Vietnamese sandwich with fresh vegetables",
  },
  {
    id: 4,
    name: "豚骨ラーメン",
    price: 10,
    image: noodle,
    description: "Rich Tonkotsu ramen with handmade noodles",
  },
  {
    id: 5,
    name: "味噌ラーメン",
    price: 11,
    image: noodle,
    description: "Miso-flavored ramen with savory broth",
  },
  {
    id: 6,
    name: "餃子",
    price: 4,
    image: banh_my,
    description: "Pan-fried dumplings with juicy filling",
  },
];

// -----------------------------------------------------
// USER
// -----------------------------------------------------

export const user = {
  id: 1,
  name: "アイン",
  avatar: ava_1,
};
