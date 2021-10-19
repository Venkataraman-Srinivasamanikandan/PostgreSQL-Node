-- Table: public.user

-- DROP TABLE public."user";

CREATE TABLE IF NOT EXISTS public."user"
(
    name text COLLATE pg_catalog."default"
)

TABLESPACE pg_default;

ALTER TABLE public."user"
    OWNER to postgres;