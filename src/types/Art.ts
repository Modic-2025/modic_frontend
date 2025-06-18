export interface Art_thumbnail {
  id: string;
  images: Array<{ imageUrl: string; imageId: string }>;
}

export interface Art extends Art_thumbnail {
  title: string;
  description: string;
  // created_at: Date;
  // updated_at: Date;
  commercialPrice: number;
  nonCommercialPrice: number;
  user_id: string;
  tags: Array<string>;
}

// export class Art_thumbnail {
//   id: string;
//   img_urls: Array<string>;

//   constructor(id: string, img_url: string) {
//     this.id = id;
//     this.img_urls = new Array(img_url);
//   }
// }

// export class Art extends Art_thumbnail {
//   title: string;
//   description: string;
//   // created_at: Date;
//   // updated_at: Date;
//   commercialPrice: number;
//   nonCommercialPrice: number;
//   user_id: string;
//   tags: Array<string>;

//   constructor(
//     id: string,
//     title: string,
//     description: string,
//     img_urls: Array<string>,
//     // created_at: Date,
//     // updated_at: Date,
//     commercialPrice: number,
//     nonCommercialPrice: number,
//     user_id: string,
//     tags: Array<string>
//   ) {
//     super(id, img_urls[0]);
//     this.title = title;
//     this.description = description;
//     this.img_urls = img_urls;
//     // this.created_at = created_at;
//     // this.updated_at = updated_at;
//     commercialPrice = commercialPrice;
//     nonCommercialPrice = nonCommercialPrice;
//     this.user_id = user_id;
//     this.tags = tags;
//   }
// }
