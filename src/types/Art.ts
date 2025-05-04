export class Art_thumbnail {
  id: string;
  img_urls: Array<string>;

  constructor(id: string, img_url: string) {
    this.id = id;
    this.img_urls = new Array(img_url);
  }
}

export class Art extends Art_thumbnail {
  title: string;
  description: string;
  created_at: Date;
  updated_at: Date;
  user_id: string;
  tags: Array<string>;

  constructor(
    id: string,
    title: string,
    description: string,
    img_urls: Array<string>,
    created_at: Date,
    updated_at: Date,
    user_id: string,
    tags: Array<string>
  ) {
    super(id, img_urls[0]);
    this.title = title;
    this.description = description;
    this.img_urls = img_urls;
    this.created_at = created_at;
    this.updated_at = updated_at;
    this.user_id = user_id;
    this.tags = tags;
  }
}

// For temporary use
export const artData: Art[] = [
  {
    id: "e4f7a3a9b432dc17",
    title: "Sunset Boulevard",
    description: "A beautiful sunset over the city.",
    img_urls: ["/images/art1_1.jpg", "/images/art1_2.jpg"],
    created_at: new Date("2024-06-01T10:00:00Z"),
    updated_at: new Date("2024-06-02T12:00:00Z"),
    user_id: "uac1098eadfe23dc",
    tags: ["sunset", "city", "nature"],
  },
  {
    id: "a19cb2d618d8a256",
    title: "Ocean Breeze",
    description: "Waves splashing under the bright sky.",
    img_urls: ["/images/art2_1.jpg", "/images/art2_2.jpg"],
    created_at: new Date("2024-05-30T15:30:00Z"),
    updated_at: new Date("2024-05-31T16:14:00Z"),
    user_id: "uafb238e89afecfb",
    tags: ["ocean", "waves", "blue"],
  },
  {
    id: "7dd3c988b69addd9",
    title: "Mountain Mist",
    description: "Mountains covered in early morning mist.",
    img_urls: ["/images/art3_1.jpg"],
    created_at: new Date("2024-06-03T07:25:00Z"),
    updated_at: new Date("2024-06-03T10:20:00Z"),
    user_id: "uef3e9c7adfe2c34",
    tags: ["mountain", "mist", "morning"],
  },
  {
    id: "c370dfa198c1b684",
    title: "Urban Lights",
    description: "City buildings illuminated at night.",
    img_urls: ["/images/art4_1.jpg"],
    created_at: new Date("2024-05-25T14:54:00Z"),
    updated_at: new Date("2024-05-25T22:24:00Z"),
    user_id: "u52c60a4fec9a873",
    tags: ["city", "lights", "night"],
  },
  {
    id: "f73e76dddf9812e2",
    title: "Forest Reflection",
    description: "Pine forest next to a calm lake.",
    img_urls: ["/images/art5_1.jpg"],
    created_at: new Date("2024-06-01T18:10:00Z"),
    updated_at: new Date("2024-06-01T19:44:00Z"),
    user_id: "u9abc152b9ce7283",
    tags: ["forest", "lake", "reflection"],
  },
  {
    id: "2b6221a0f8ae37f7",
    title: "Golden Meadow",
    description: "A field of golden flowers under the sun.",
    img_urls: ["/images/art6_1.jpg"],
    created_at: new Date("2024-05-29T11:12:00Z"),
    updated_at: new Date("2024-05-30T09:35:00Z"),
    user_id: "ua47ad6192b5ef6d",
    tags: ["meadow", "flowers", "golden"],
  },
  {
    id: "d63bc51e5e410602",
    title: "Abstract Blue",
    description: "Abstract blue swirls of color.",
    img_urls: ["/images/art7_1.jpg"],
    created_at: new Date("2024-06-02T08:08:00Z"),
    updated_at: new Date("2024-06-02T09:09:00Z"),
    user_id: "ue4a32bac1a56412",
    tags: ["abstract", "blue", "swirl"],
  },
  {
    id: "f88fa519cc41bab7",
    title: "Wildflowers",
    description: "Field filled with various colored wildflowers.",
    img_urls: ["/images/art8_1.jpg"],
    created_at: new Date("2024-05-27T13:13:00Z"),
    updated_at: new Date("2024-05-28T07:07:00Z"),
    user_id: "u8a8943c51b2de19",
    tags: ["wildflowers", "field", "nature"],
  },
  {
    id: "65ad71b6fc1e81d7",
    title: "Rainy Street",
    description: "A city street shimmering in the rain.",
    img_urls: ["/images/art9_1.jpg"],
    created_at: new Date("2024-06-04T11:11:00Z"),
    updated_at: new Date("2024-06-04T12:44:00Z"),
    user_id: "u34bac15cf384dfa",
    tags: ["rain", "street", "city"],
  },
  {
    id: "b897647cfdf48a67",
    title: "Classic Portrait",
    description: "A classic portrait of a young woman.",
    img_urls: ["/images/art10_1.jpg"],
    created_at: new Date("2024-05-10T08:00:00Z"),
    updated_at: new Date("2024-05-15T10:00:00Z"),
    user_id: "u7afc2153ce8fbac",
    tags: ["portrait", "classic", "woman"],
  },
  {
    id: "96e8ae4d9b3a32ce",
    title: "Space Dream",
    description: "A fantasy space landscape with planets.",
    img_urls: ["/images/art11_1.jpg"],
    created_at: new Date("2024-06-01T20:08:00Z"),
    updated_at: new Date("2024-06-02T07:52:00Z"),
    user_id: "u1a35bcf7eca8219",
    tags: ["space", "planet", "fantasy"],
  },
  {
    id: "1ea1c7c6e2d85882",
    title: "Autumn Leaves",
    description: "Leaves falling and covering a park path.",
    img_urls: ["/images/art12_1.jpg"],
    created_at: new Date("2024-05-23T16:30:00Z"),
    updated_at: new Date("2024-05-25T17:26:00Z"),
    user_id: "ud8951b6e8723cad",
    tags: ["autumn", "leaves", "park"],
  },
  {
    id: "41914d1bcc1e9293",
    title: "Retro Car",
    description: "A red retro car in front of a cafe.",
    img_urls: ["/images/art13_1.jpg"],
    created_at: new Date("2024-05-17T12:23:00Z"),
    updated_at: new Date("2024-05-20T10:21:00Z"),
    user_id: "u4267cfe12a189fb",
    tags: ["car", "retro", "cafe"],
  },
  {
    id: "5804df6e7ec76c32",
    title: "Mystic Forest",
    description: "Deep forest with rays of light falling in.",
    img_urls: ["/images/art14_1.jpg"],
    created_at: new Date("2024-06-04T09:09:00Z"),
    updated_at: new Date("2024-06-04T12:12:00Z"),
    user_id: "u15f3be6731dabca",
    tags: ["forest", "light", "mystic"],
  },
  {
    id: "577d3dd45c928c99",
    title: "Color Splash",
    description: "Bright colors splashing on a white canvas.",
    img_urls: ["/images/art15_1.jpg"],
    created_at: new Date("2024-06-03T10:10:00Z"),
    updated_at: new Date("2024-06-03T18:20:00Z"),
    user_id: "u5983b2cd139faec",
    tags: ["color", "canvas", "abstract"],
  },
  {
    id: "a7d32ddfea81d33c",
    title: "Serenity",
    description: "A calm scenery of mountains and a lake.",
    img_urls: ["/images/art16_1.jpg"],
    created_at: new Date("2024-05-28T15:46:00Z"),
    updated_at: new Date("2024-05-30T09:18:00Z"),
    user_id: "u184b91ff3abe2ac",
    tags: ["serene", "lake", "mountain"],
  },
  {
    id: "d6195aab0e9e6ff0",
    title: "Joyful Dance",
    description: "Silhouette figures dancing with joy.",
    img_urls: ["/images/art17_1.jpg"],
    created_at: new Date("2024-05-26T18:28:00Z"),
    updated_at: new Date("2024-05-26T19:30:00Z"),
    user_id: "ua9cefea92487cbc",
    tags: ["dance", "joyful", "silhouette"],
  },
  {
    id: "07fee42ddde6b9f9",
    title: "Silent Night",
    description: "A snowy town on a quiet winter night.",
    img_urls: ["/images/art18_1.jpg"],
    created_at: new Date("2024-05-29T21:16:00Z"),
    updated_at: new Date("2024-05-29T23:08:00Z"),
    user_id: "u219dd3143bacfed",
    tags: ["night", "snow", "town"],
  },
  {
    id: "8a2241741899c36a",
    title: "Flower Parade",
    description: "A parade float covered in blooming flowers.",
    img_urls: ["/images/art19_1.jpg"],
    created_at: new Date("2024-06-02T13:34:00Z"),
    updated_at: new Date("2024-06-02T20:44:00Z"),
    user_id: "u86b1bd7f6e1ace9",
    tags: ["parade", "flower", "bloom"],
  },
  {
    id: "277be6bca9181566",
    title: "Digital Waves",
    description: "Abstract digital waves on a dark background.",
    img_urls: ["/images/art20_1.jpg"],
    created_at: new Date("2024-06-03T17:59:00Z"),
    updated_at: new Date("2024-06-03T22:32:00Z"),
    user_id: "u7f8e13cae221f0b",
    tags: ["digital", "wave", "abstract"],
  },
  {
    id: "fe4ca774da17bf09",
    title: "Lavender Dream",
    description: "Fields of lavender purple blooming at dawn.",
    img_urls: ["/images/art21_1.jpg"],
    created_at: new Date("2024-06-01T05:50:00Z"),
    updated_at: new Date("2024-06-01T06:12:00Z"),
    user_id: "u45ad617879ae9d7",
    tags: ["lavender", "field", "dawn"],
  },
  {
    id: "e7840d791b5dbf12",
    title: "All that Jazz",
    description: "Jazz musicians playing sax and trumpet.",
    img_urls: ["/images/art22_1.jpg"],
    created_at: new Date("2024-05-24T19:11:00Z"),
    updated_at: new Date("2024-05-24T23:25:00Z"),
    user_id: "ub312a54f6b8eac1",
    tags: ["jazz", "music", "musician"],
  },
  {
    id: "acf9dd980c1e2ed1",
    title: "Fireflies Night",
    description: "Fireflies glow in a summer garden.",
    img_urls: ["/images/art23_1.jpg"],
    created_at: new Date("2024-05-30T21:17:00Z"),
    updated_at: new Date("2024-06-01T09:08:00Z"),
    user_id: "u36af789fbad309e",
    tags: ["fireflies", "night", "garden"],
  },
  {
    id: "39551c45e883b838",
    title: "Pastel City",
    description: "Cityscape in pastel tones at sunrise.",
    img_urls: ["/images/art24_1.jpg"],
    created_at: new Date("2024-06-04T06:09:00Z"),
    updated_at: new Date("2024-06-04T11:15:00Z"),
    user_id: "ud314e8acb2ff617",
    tags: ["city", "pastel", "sunrise"],
  },
  {
    id: "62e6fe49dcfbd442",
    title: "Safari Journey",
    description: "Animals crossing a river in the savanna.",
    img_urls: ["/images/art25_1.jpg"],
    created_at: new Date("2024-05-17T17:34:00Z"),
    updated_at: new Date("2024-05-20T12:17:00Z"),
    user_id: "u2d71f0c35faab98",
    tags: ["safari", "animal", "river"],
  },
  {
    id: "2a62c9775eb050d4",
    title: "Midnight Galaxy",
    description: "A galaxy spiraling in deep space.",
    img_urls: ["/images/art26_1.jpg"],
    created_at: new Date("2024-05-28T23:21:00Z"),
    updated_at: new Date("2024-05-29T04:14:00Z"),
    user_id: "uf1a8b72e7d661c4",
    tags: ["galaxy", "space", "midnight"],
  },
  {
    id: "ffbe13ac430e7f23",
    title: "Vintage Bicycle",
    description: "An old bicycle leaning against a fence.",
    img_urls: ["/images/art27_1.jpg"],
    created_at: new Date("2024-06-02T18:20:00Z"),
    updated_at: new Date("2024-06-03T08:50:00Z"),
    user_id: "u6a7e34135def89a",
    tags: ["bicycle", "vintage", "fence"],
  },
  {
    id: "ec83cbd43baeb014",
    title: "Cloud Symphony",
    description: "Cloud formations above a green valley.",
    img_urls: ["/images/art28_1.jpg"],
    created_at: new Date("2024-06-03T15:44:00Z"),
    updated_at: new Date("2024-06-04T00:18:00Z"),
    user_id: "uec458b431cfad11",
    tags: ["cloud", "valley", "sky"],
  },
  {
    id: "1efcca3076b18912",
    title: "Café Window",
    description: "A rainy day seen from a cozy café window.",
    img_urls: ["/images/art29_1.jpg"],
    created_at: new Date("2024-05-31T09:18:00Z"),
    updated_at: new Date("2024-06-01T05:10:00Z"),
    user_id: "ud47caf1bbe983a2",
    tags: ["cafe", "window", "rain"],
  },
  {
    id: "d92e4b83e9462780",
    title: "Spring Harmony",
    description: "Blossoming trees and singing birds in spring.",
    img_urls: ["/images/art30_1.jpg"],
    created_at: new Date("2024-06-01T14:30:00Z"),
    updated_at: new Date("2024-06-01T15:05:00Z"),
    user_id: "u398afef9b8e1c7a",
    tags: ["spring", "tree", "bird"],
  },
];

export const artThumbnails: Art_thumbnail[] = artData.map((art) => ({
  id: art.id,
  img_urls: [art.img_urls[0]], // 썸네일 이미지
}));

export const getArtById = (id: string): Art | undefined => {
  return artData.find((art) => art.id === id);
};
