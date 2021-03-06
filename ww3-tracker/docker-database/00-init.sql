CREATE DATABASE ww3_tracker;
\connect ww3_tracker;
/*Create user table in public schema*/
CREATE TABLE public.users (
  username TEXT PRIMARY KEY,
  pass TEXT,
  created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE public.posts (
  id SERIAL PRIMARY KEY,
  title TEXT,
  description TEXT,
  lng DECIMAL,
  lat DECIMAL,
  author TEXT REFERENCES users,
  url TEXT,
  created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE public.comments (
  id SERIAL PRIMARY KEY,
  content TEXT,
  author TEXT REFERENCES users,
  postid INTEGER REFERENCES posts,
  created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE public.comment_votes (
  id SERIAL PRIMARY KEY,
  username TEXT REFERENCES users,
  comment_id INTEGER REFERENCES comments,
  vote TEXT CHECK(vote = 'up' OR vote = 'down'),
  created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(username, comment_id)
);

CREATE TABLE public.post_votes (
  id SERIAL PRIMARY KEY,
  username TEXT REFERENCES users,
  post_id INTEGER REFERENCES posts,
  vote TEXT CHECK(vote = 'up' OR vote = 'down'),
  created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(username, post_id)
);


