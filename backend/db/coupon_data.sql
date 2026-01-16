--
-- PostgreSQL database dump
--

\restrict PebL5KAvgcljwaNEz33mkDHm7ZY76c20srBRitsDt5J8jdMy70j1vWN9858gpBf

-- Dumped from database version 18.1
-- Dumped by pg_dump version 18.1

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: coupons; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.coupons (
    id integer NOT NULL,
    code character varying(6) NOT NULL,
    status character varying(50) DEFAULT 'ACTIVE'::character varying NOT NULL,
    created_by integer NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    used_at timestamp without time zone,
    CONSTRAINT coupons_status_check CHECK (((status)::text = ANY ((ARRAY['ACTIVE'::character varying, 'USED'::character varying, 'EXPIRED'::character varying])::text[])))
);


ALTER TABLE public.coupons OWNER TO postgres;

--
-- Name: coupons_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.coupons_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.coupons_id_seq OWNER TO postgres;

--
-- Name: coupons_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.coupons_id_seq OWNED BY public.coupons.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    password character varying(255),
    role character varying(50) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    confirmpassword character varying(255)
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: coupons id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.coupons ALTER COLUMN id SET DEFAULT nextval('public.coupons_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: coupons; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.coupons (id, code, status, created_by, created_at, used_at) FROM stdin;
1	YD0SWK	ACTIVE	13	2026-01-08 17:26:55.980957	\N
2	2UQRQD	USED	13	2026-01-09 13:35:38.433322	2026-01-09 17:35:49.761208
4	Y23DBH	USED	13	2026-01-12 11:37:55.223261	2026-01-12 11:59:55.176888
3	LIMXO0	USED	13	2026-01-12 11:37:48.147899	2026-01-12 12:31:15.57361
5	5WXMLP	USED	13	2026-01-12 13:11:13.960147	2026-01-12 13:13:27.109276
8	YPW0PU	ACTIVE	13	2026-01-12 18:27:34.303249	\N
9	LLI8FN	ACTIVE	13	2026-01-12 18:27:36.245708	\N
6	6FX2ZY	USED	13	2026-01-12 13:11:18.567782	2026-01-13 10:59:09.115961
10	VMEWSH	ACTIVE	13	2026-01-13 14:24:59.333639	\N
7	ZTPUE7	USED	13	2026-01-12 13:11:22.708531	2026-01-13 14:25:47.468338
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, name, email, password, role, created_at, confirmpassword) FROM stdin;
13	bhagya T	tekuribhagya@gmail.com	$2b$10$7Gdj49aZmh7mXvbT6jNuV.QfbO4VDcH0CsXz7o4ztbyLDZHVwwhWq	admin	2026-01-08 10:08:56.123888	\N
14	Lakshmi	lakshmi27web@gmail.com	$2b$10$KgjB1J/dHOpMcgK7tQ2LAuG4H0lJYgV3z/5Gqv3x8cwcEsA8My/yW	user	2026-01-08 10:43:06.545945	\N
15	Jack	jack123@gmail.com	$2b$10$ew5d/thKVE42n3SwhVP3xugdlsZTt6lo5K1ico.T1hI6q/gN2mhQW	user	2026-01-09 14:16:03.837933	\N
16	John Doe	john@example.com	$2b$10$5Qj40hVQtw4GMY2qkjcIUuG1A2Ayq9jYpvRx9ePN8CVbALi3KFutC	admin	2026-01-09 14:39:52.97408	\N
17	Sree	bhagyatekuri@gmail.com	$2b$10$.vZ25bjIKBlErWtmQo5w/OKrE0XT/7AZWUSxp8Q3i/OBMqOzWDMl.	user	2026-01-12 20:14:03.32338	\N
18	ABCD	abcde@gmail.com	$2b$10$EoIhsOZuQdQuRNGKMGHAVecszP3BSmpSSEOi2O55mZbm9qgkm0mcm	user	2026-01-12 21:23:57.677962	\N
19	Bhagi	tekuribhagi@gmail.com	$2b$10$oF37DPdBXp6l8zZnutZEY.UwwrrLouztDAs3PggQwg2ebvMlzy67S	user	2026-01-13 10:58:30.956437	\N
20	Alex	alex123@gmail.com	$2b$10$HeBIHK9k0tzIZV2Nf7jR/.4AO37Fb2bSiF.wJnzGbQQXRDEmLX3TS	user	2026-01-13 14:26:39.468688	\N
\.


--
-- Name: coupons_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.coupons_id_seq', 10, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 20, true);


--
-- Name: coupons coupons_code_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.coupons
    ADD CONSTRAINT coupons_code_key UNIQUE (code);


--
-- Name: coupons coupons_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.coupons
    ADD CONSTRAINT coupons_pkey PRIMARY KEY (id);


--
-- Name: users unique_email; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT unique_email UNIQUE (email);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: idx_coupons_code; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_coupons_code ON public.coupons USING btree (code);


--
-- Name: idx_coupons_created_by; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_coupons_created_by ON public.coupons USING btree (created_by);


--
-- Name: idx_coupons_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_coupons_status ON public.coupons USING btree (status);


--
-- Name: idx_users_email; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_users_email ON public.users USING btree (email);


--
-- Name: coupons coupons_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.coupons
    ADD CONSTRAINT coupons_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict PebL5KAvgcljwaNEz33mkDHm7ZY76c20srBRitsDt5J8jdMy70j1vWN9858gpBf

