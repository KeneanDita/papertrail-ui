export type Health = {
  status: string;
  uptime: number;
  env: string;
  version: string;
};

export type User = {
  id: string;
  email: string;
  role: string;
  created_at: string;
};

export type Paper = {
  id: string;
  title: string;
  abstract: string;
  author_id: string;
  pdf_url: string;
  created_at: string;
};

export type Review = {
  id: string;
  paper_id: string;
  reviewer_id: string;
  rating: number;
  comments: string;
  created_at: string;
};

export type Comment = {
  id: string;
  paper_id: string;
  user_id: string;
  body: string;
  created_at: string;
};
