-- Table: public.authors

-- DROP TABLE public.authors;

CREATE EXTENSION IF NOT EXISTS citext;

CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TABLE IF NOT EXISTS authors
(
    id SERIAL,
    name citext NOT NULL,
    created_by text NOT NULL DEFAULT 'system',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT authors_pkey PRIMARY KEY (id),
    CONSTRAINT name_unique UNIQUE (name)
)
WITH (
    OIDS = FALSE
)

TABLESPACE pg_default;

DROP TRIGGER IF EXISTS set_timestamp ON authors;
CREATE TRIGGER set_timestamp
BEFORE UPDATE ON authors
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

ALTER TABLE authors
    OWNER to postgres;

ALTER TABLE authors 
    ALTER COLUMN created_at TYPE TIMESTAMP,
    ALTER COLUMN updated_at TYPE TIMESTAMP;
