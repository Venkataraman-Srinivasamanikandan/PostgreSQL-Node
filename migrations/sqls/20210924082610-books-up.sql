-- Table: public.books

-- DROP TABLE public.books;

CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TABLE IF NOT EXISTS books
(
    id SERIAL,
    name text NOT NULL,
    "authorId" integer NOT NULL,
    created_by text NOT NULL DEFAULT 'system',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT books_pkey PRIMARY KEY (id),
    CONSTRAINT "authorId" FOREIGN KEY ("authorId")
        REFERENCES authors (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)
WITH (
    OIDS = FALSE
)

TABLESPACE pg_default;

DROP TRIGGER IF EXISTS set_timestamp ON books;
CREATE TRIGGER set_timestamp
BEFORE UPDATE ON books
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

ALTER TABLE books
    OWNER to postgres;

ALTER TABLE books 
    ALTER COLUMN created_at TYPE TIMESTAMP,
    ALTER COLUMN updated_at TYPE TIMESTAMP;