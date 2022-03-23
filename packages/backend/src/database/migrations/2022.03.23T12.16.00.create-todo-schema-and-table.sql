CREATE SCHEMA todo_app;

CREATE TYPE todo_status AS ENUM('created', 'completed');

CREATE TABLE todo_app.todo (
  id UUID,
  title VARCHAR NOT NULL,
  description VARCHAR NOT NULL,
  status todo_status NOT NULL,
  created_at TIMESTAMPTZ NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL,
  completed_at TIMESTAMPTZ,
  PRIMARY KEY (id)
);
