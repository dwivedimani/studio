
export interface BlogPost {
  id: string; // This will be the string representation of MongoDB's _id
  slug: string;
  title: string;
  author: string;
  date: string; // ISO date string
  content: string;
  excerpt?: string; // Optional short summary
}

export interface NewBlogPost {
  title: string;
  content: string;
  author?: string; // Optional, can be defaulted to Admin
  excerpt?: string;
}
