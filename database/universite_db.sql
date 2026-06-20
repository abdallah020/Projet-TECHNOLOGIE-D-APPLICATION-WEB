--
-- PostgreSQL database dump
--

\restrict hvDkrGDP9Ed0k1XnSgCud5MU3nsmEbeNC2nxEOfkujGgtEYdfLGbDSAwIEW6C85

-- Dumped from database version 15.14 (Homebrew)
-- Dumped by pg_dump version 15.14 (Homebrew)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: universite_user
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO universite_user;

--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: affectations_enseignants; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.affectations_enseignants (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    enseignant_id uuid NOT NULL,
    formation_id uuid NOT NULL,
    role character varying(100),
    date_debut date,
    date_fin date,
    heures_prevues integer,
    date_creation timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT affectations_enseignants_role_check CHECK (((role)::text = ANY ((ARRAY['COORDINATEUR'::character varying, 'ENSEIGNANT'::character varying, 'TUTEUR'::character varying, 'RESPONSABLE'::character varying])::text[])))
);


ALTER TABLE public.affectations_enseignants OWNER TO postgres;

--
-- Name: autres_formations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.autres_formations (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    etudiant_id uuid NOT NULL,
    nom_formation character varying(255) NOT NULL,
    institution character varying(255),
    date_obtention date,
    diplome character varying(255),
    date_creation timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.autres_formations OWNER TO postgres;

--
-- Name: bilans_stages; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.bilans_stages (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    etudiant_id uuid NOT NULL,
    partenaire_id uuid,
    date_debut_stage date NOT NULL,
    date_fin_stage date NOT NULL,
    description_activites text,
    competences_acquises text,
    note_stage numeric(4,2),
    rapport_url character varying(500),
    superviseur_nom character varying(255),
    superviseur_email character varying(255),
    statut character varying(50) DEFAULT 'EN_COURS'::character varying,
    date_creation timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT bilans_stages_statut_check CHECK (((statut)::text = ANY ((ARRAY['EN_COURS'::character varying, 'VALIDÉ'::character varying, 'REJETÉ'::character varying])::text[])))
);


ALTER TABLE public.bilans_stages OWNER TO postgres;

--
-- Name: budgets; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.budgets (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    annee_budgetaire integer NOT NULL,
    formation_id uuid,
    budget_previsionnel numeric(12,2) NOT NULL,
    budget_realise numeric(12,2) DEFAULT 0,
    note_orientation text,
    responsable_id uuid,
    date_creation timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    date_modification timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.budgets OWNER TO postgres;

--
-- Name: communications; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.communications (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    titre character varying(255) NOT NULL,
    contenu text NOT NULL,
    type_communication character varying(100) NOT NULL,
    auteur_id uuid NOT NULL,
    date_creation timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    date_modification timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    date_publication timestamp without time zone,
    visible_au_public boolean DEFAULT false,
    archivee boolean DEFAULT false,
    statut character varying(50),
    type character varying(50),
    CONSTRAINT communications_type_communication_check CHECK (((type_communication)::text = ANY ((ARRAY['REUNION'::character varying, 'ANNONCE'::character varying, 'NOTE'::character varying, 'INFO'::character varying])::text[])))
);


ALTER TABLE public.communications OWNER TO postgres;

--
-- Name: cours; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cours (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    code character varying(20),
    nom character varying(255) NOT NULL,
    description text,
    formation_id uuid NOT NULL,
    enseignant_id uuid,
    credits integer DEFAULT 3,
    duree_heures integer,
    type_cours character varying(50),
    date_creation timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT cours_type_cours_check CHECK (((type_cours)::text = ANY ((ARRAY['COURS'::character varying, 'TD'::character varying, 'TP'::character varying, 'MIXTE'::character varying])::text[])))
);


ALTER TABLE public.cours OWNER TO postgres;

--
-- Name: diplomes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.diplomes (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    etudiant_id uuid NOT NULL,
    formation_id uuid NOT NULL,
    nom_diplome character varying(255) NOT NULL,
    date_obtention date NOT NULL,
    numero_diplome character varying(50),
    mention character varying(100),
    note_finale numeric(4,2),
    date_creation timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.diplomes OWNER TO postgres;

--
-- Name: documents; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.documents (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    nom character varying(255) NOT NULL,
    description text,
    type_document character varying(100) NOT NULL,
    chemin_fichier character varying(500) NOT NULL,
    taille_bytes bigint,
    extension character varying(10),
    proprietaire_id uuid,
    communication_id uuid,
    date_creation timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    date_modification timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    visible_pour_roles text,
    CONSTRAINT documents_type_document_check CHECK (((type_document)::text = ANY ((ARRAY['COURRIER_ARRIVEE'::character varying, 'COURRIER_DEPART'::character varying, 'NOTE_SERVICE'::character varying, 'NOTE_ADMINISTRATIVE'::character varying, 'CIRCULAIRE'::character varying, 'RAPPORT'::character varying, 'CONTRAT'::character varying, 'AUTRE'::character varying])::text[])))
);


ALTER TABLE public.documents OWNER TO postgres;

--
-- Name: emplois_du_temps; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.emplois_du_temps (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    formation_id uuid NOT NULL,
    cours_id uuid,
    enseignant_id uuid,
    jour_semaine character varying(20) NOT NULL,
    heure_debut time without time zone NOT NULL,
    heure_fin time without time zone NOT NULL,
    salle character varying(50),
    groupe character varying(50),
    date_debut date,
    date_fin date,
    statut character varying(20) DEFAULT 'PLANIFIÉ'::character varying,
    date_creation timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT emplois_du_temps_jour_semaine_check CHECK (((jour_semaine)::text = ANY ((ARRAY['LUNDI'::character varying, 'MARDI'::character varying, 'MERCREDI'::character varying, 'JEUDI'::character varying, 'VENDREDI'::character varying, 'SAMEDI'::character varying])::text[]))),
    CONSTRAINT emplois_du_temps_statut_check CHECK (((statut)::text = ANY ((ARRAY['PLANIFIÉ'::character varying, 'EN_COURS'::character varying, 'TERMINÉ'::character varying, 'ANNULÉ'::character varying])::text[])))
);


ALTER TABLE public.emplois_du_temps OWNER TO postgres;

--
-- Name: enseignants; Type: TABLE; Schema: public; Owner: universite_user
--

CREATE TABLE public.enseignants (
    id uuid NOT NULL,
    bureau_numero character varying(255),
    cv_url character varying(255),
    date_embauche date,
    diplome_supreme character varying(255),
    grade character varying(255),
    nom character varying(255),
    numero_agent character varying(255) NOT NULL,
    prenom character varying(255),
    specialite character varying(255),
    statut character varying(255) NOT NULL
);


ALTER TABLE public.enseignants OWNER TO universite_user;

--
-- Name: etudiants; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.etudiants (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    ine character varying(20) NOT NULL,
    utilisateur_id uuid,
    date_naissance date,
    adresse character varying(255),
    ville character varying(100),
    codepostal character varying(10),
    pays character varying(100) DEFAULT 'Sénégal'::character varying,
    telephone_parent character varying(20),
    contact_urgence character varying(255),
    formation_actuelle_id uuid,
    promo character varying(50),
    annee_debut integer,
    annee_sortie integer,
    statut character varying(50) DEFAULT 'ACTIF'::character varying,
    moyenne_generale numeric(4,2),
    date_creation timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    date_modification timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    email character varying(255),
    nom character varying(255),
    prenom character varying(255),
    formation character varying(255),
    CONSTRAINT etudiants_statut_check CHECK (((statut)::text = ANY ((ARRAY['ACTIF'::character varying, 'SUSPENDU'::character varying, 'DIPLÔMÉ'::character varying, 'RETIRÉ'::character varying])::text[])))
);


ALTER TABLE public.etudiants OWNER TO postgres;

--
-- Name: formations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.formations (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    code character varying(20) NOT NULL,
    nom character varying(255) NOT NULL,
    description text,
    type_formation character varying(100) NOT NULL,
    niveau character varying(50) NOT NULL,
    date_debut date NOT NULL,
    date_fin date NOT NULL,
    duree_heures integer,
    nombre_etudiants integer DEFAULT 0,
    nombre_hommes integer DEFAULT 0,
    nombre_femmes integer DEFAULT 0,
    budget_total numeric(12,2) DEFAULT 0,
    type_financement character varying(100),
    responsable_id uuid,
    statut character varying(20) DEFAULT 'PLANIFIÉE'::character varying,
    date_creation timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    date_modification timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT formations_niveau_check CHECK (((niveau)::text = ANY ((ARRAY['LICENCE'::character varying, 'MASTER'::character varying, 'DOCTORAT'::character varying, 'CERTIFICAT'::character varying, 'COURTE DURÉE'::character varying])::text[]))),
    CONSTRAINT formations_statut_check CHECK (((statut)::text = ANY (ARRAY[('PLANIFIEE'::character varying)::text, ('EN_COURS'::character varying)::text, ('TERMINEE'::character varying)::text, ('ANNULEE'::character varying)::text]))),
    CONSTRAINT formations_type_formation_check CHECK (((type_formation)::text = ANY ((ARRAY['DIPLÔMANTE'::character varying, 'CERTIFICATION'::character varying, 'COURTE'::character varying, 'LONGUE'::character varying])::text[])))
);


ALTER TABLE public.formations OWNER TO postgres;

--
-- Name: inscriptions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.inscriptions (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    etudiant_id uuid NOT NULL,
    formation_id uuid NOT NULL,
    date_inscription timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    date_debut date,
    date_fin date,
    statut character varying(50) DEFAULT 'INSCRIT'::character varying,
    moyenne_formation numeric(4,2),
    CONSTRAINT inscriptions_statut_check CHECK (((statut)::text = ANY ((ARRAY['INSCRIT'::character varying, 'SUSPENDU'::character varying, 'DIPLÔMÉ'::character varying, 'RETIRÉ'::character varying])::text[])))
);


ALTER TABLE public.inscriptions OWNER TO postgres;

--
-- Name: logs_audit; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.logs_audit (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    utilisateur_id uuid,
    action character varying(100) NOT NULL,
    entite_type character varying(100),
    entite_id uuid,
    ancien_valeurs jsonb,
    nouvelles_valeurs jsonb,
    adresse_ip character varying(50),
    date_action timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.logs_audit OWNER TO postgres;

--
-- Name: notifications; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.notifications (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    utilisateur_id uuid NOT NULL,
    type_notification character varying(100),
    titre character varying(255) NOT NULL,
    message text NOT NULL,
    entite_type character varying(100),
    entite_id uuid,
    lu boolean DEFAULT false,
    date_creation timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    date_lecture timestamp without time zone
);


ALTER TABLE public.notifications OWNER TO postgres;

--
-- Name: partenaires; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.partenaires (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    nom character varying(255) NOT NULL,
    type_partenaire character varying(100),
    adresse character varying(255),
    email character varying(255),
    telephone character varying(20),
    contact_principal character varying(255),
    domaines_activite character varying(500),
    date_partenariat date,
    statut character varying(50) DEFAULT 'ACTIF'::character varying,
    date_creation timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT partenaires_statut_check CHECK (((statut)::text = ANY ((ARRAY['ACTIF'::character varying, 'INACTIF'::character varying, 'SUSPENDU'::character varying])::text[]))),
    CONSTRAINT partenaires_type_partenaire_check CHECK (((type_partenaire)::text = ANY ((ARRAY['ENTREPRISE'::character varying, 'ONG'::character varying, 'GOUVERNEMENTAL'::character varying, 'EDUCATIONAL'::character varying, 'FINANCIER'::character varying])::text[])))
);


ALTER TABLE public.partenaires OWNER TO postgres;

--
-- Name: reunion_participants; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.reunion_participants (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    reunion_id uuid NOT NULL,
    participant_id uuid NOT NULL,
    statut_participation character varying(50) DEFAULT 'INVITÉ'::character varying,
    CONSTRAINT reunion_participants_statut_participation_check CHECK (((statut_participation)::text = ANY ((ARRAY['INVITÉ'::character varying, 'CONFIRMÉ'::character varying, 'ABSENT'::character varying, 'PRÉSENT'::character varying])::text[])))
);


ALTER TABLE public.reunion_participants OWNER TO postgres;

--
-- Name: reunions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.reunions (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    titre character varying(255) NOT NULL,
    description text,
    type_reunion character varying(100) NOT NULL,
    formation_id uuid,
    organisateur_id uuid NOT NULL,
    date_reunion timestamp without time zone NOT NULL,
    duree_minutes integer DEFAULT 60,
    lieu character varying(255),
    statut character varying(50) DEFAULT 'PLANIFIÉE'::character varying,
    compte_rendu_id uuid,
    date_creation timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT reunions_statut_check CHECK (((statut)::text = ANY ((ARRAY['PLANIFIÉE'::character varying, 'EN_COURS'::character varying, 'TERMINÉE'::character varying, 'ANNULÉE'::character varying])::text[]))),
    CONSTRAINT reunions_type_reunion_check CHECK (((type_reunion)::text = ANY ((ARRAY['TUTORAT'::character varying, 'PREPARATION_COURS'::character varying, 'EVALUATION'::character varying, 'ADMINISTRATIVE'::character varying, 'PEDAGOGIQUE'::character varying])::text[])))
);


ALTER TABLE public.reunions OWNER TO postgres;

--
-- Name: suivi_insertion; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.suivi_insertion (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    etudiant_id uuid NOT NULL,
    type_insertion character varying(100) NOT NULL,
    entreprise_nom character varying(255),
    poste character varying(255),
    secteur_activite character varying(100),
    salaire_mensuel numeric(10,2),
    date_debut_emploi date,
    date_enregistrement timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    contact_registre character varying(255),
    statut_inscription character varying(50) DEFAULT 'ENREGISTRÉ'::character varying,
    CONSTRAINT suivi_insertion_type_insertion_check CHECK (((type_insertion)::text = ANY ((ARRAY['AUTO_EMPLOI'::character varying, 'EMPLOI_SALARIE'::character varying, 'POURSUITE_ETUDES'::character varying, 'RECHERCHE'::character varying])::text[])))
);


ALTER TABLE public.suivi_insertion OWNER TO postgres;

--
-- Name: utilisateurs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.utilisateurs (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    email character varying(255) NOT NULL,
    mot_de_passe character varying(255) NOT NULL,
    nom character varying(100) NOT NULL,
    prenom character varying(100) NOT NULL,
    telephone character varying(20),
    photo_url character varying(500),
    role character varying(50) NOT NULL,
    statut character varying(20) DEFAULT 'ACTIF'::character varying,
    actif boolean DEFAULT true,
    date_creation timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    date_modification timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT utilisateurs_role_check CHECK (((role)::text = ANY ((ARRAY['ADMIN'::character varying, 'ADMINISTRATIF'::character varying, 'ENSEIGNANT'::character varying, 'ENSEIGNANT_ASSOCIE'::character varying, 'RESPONSABLE_FORMATION'::character varying, 'TUTEUR'::character varying, 'APPUI_INSERTION'::character varying, 'ETUDIANT'::character varying])::text[]))),
    CONSTRAINT utilisateurs_statut_check CHECK (((statut)::text = ANY ((ARRAY['ACTIF'::character varying, 'INACTIF'::character varying, 'SUSPENDU'::character varying])::text[])))
);


ALTER TABLE public.utilisateurs OWNER TO postgres;

--
-- Data for Name: affectations_enseignants; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.affectations_enseignants (id, enseignant_id, formation_id, role, date_debut, date_fin, heures_prevues, date_creation) FROM stdin;
\.


--
-- Data for Name: autres_formations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.autres_formations (id, etudiant_id, nom_formation, institution, date_obtention, diplome, date_creation) FROM stdin;
\.


--
-- Data for Name: bilans_stages; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.bilans_stages (id, etudiant_id, partenaire_id, date_debut_stage, date_fin_stage, description_activites, competences_acquises, note_stage, rapport_url, superviseur_nom, superviseur_email, statut, date_creation) FROM stdin;
\.


--
-- Data for Name: budgets; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.budgets (id, annee_budgetaire, formation_id, budget_previsionnel, budget_realise, note_orientation, responsable_id, date_creation, date_modification) FROM stdin;
\.


--
-- Data for Name: communications; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.communications (id, titre, contenu, type_communication, auteur_id, date_creation, date_modification, date_publication, visible_au_public, archivee, statut, type) FROM stdin;
0a30ee0e-c58a-4551-81e6-fdae3f50d117	Réunion pédagogique	Compte rendu de la réunion sur l'organisation des examens	REUNION	e5a445cd-331d-42fc-b990-12a91af3f05c	2026-06-11 03:28:12.985831	2026-06-11 03:28:12.992874	\N	f	f	\N	\N
1cc3d8da-13e4-4cfd-96a6-eafbd7e45cb2	Réunion pédagogique	Compte rendu de la réunion sur l'organisation des examens	REUNION	97a78cc3-e4f5-4240-a1d0-9f70b19c04a0	2026-06-16 00:13:23.273322	2026-06-16 00:13:23.298408	\N	f	f	\N	\N
b4be9a44-5355-4fc7-bb8f-fc403dacb3c8	Réunion pédagogique	Compte rendu de la réunion sur l'organisation des examens	REUNION	97a78cc3-e4f5-4240-a1d0-9f70b19c04a0	2026-06-16 00:27:25.337406	2026-06-16 00:27:25.364959	\N	f	f	\N	\N
7cd15cb5-2a53-4407-8594-d75568c877be	Réunion pédagogique	Compte rendu de la réunion sur l'organisation des examens	INFO	97a78cc3-e4f5-4240-a1d0-9f70b19c04a0	2026-06-16 00:45:32.57343	2026-06-16 00:45:32.593356	\N	f	f	BROUILLON	\N
5eaf762b-a527-4e29-a289-8569a10c29b0	Réunion pédagogique	Compte rendu des examens	REUNION	97a78cc3-e4f5-4240-a1d0-9f70b19c04a0	2026-06-16 00:45:49.637153	2026-06-16 00:45:49.638661	\N	f	f	BROUILLON	\N
afcff8fd-f10a-4699-9251-f8af670260e3	Test	Hello	REUNION	97a78cc3-e4f5-4240-a1d0-9f70b19c04a0	2026-06-16 01:52:05.378936	2026-06-16 01:52:05.407169	\N	f	f	BROUILLON	\N
09eb0c8f-451f-4cbb-a500-cf2ca92d5485	Test2	Hello	REUNION	df156b5d-aed2-4c1b-954d-c26b815eec04	2026-06-16 03:30:43.231935	2026-06-16 03:30:43.261446	\N	f	f	BROUILLON	\N
be634c88-fd59-4d0b-95d7-b3690e41b1ec	Pour tout les etudiant	Merci de rejoindre votre école	ANNONCE	df156b5d-aed2-4c1b-954d-c26b815eec04	2026-06-18 00:13:39.333434	2026-06-18 00:13:39.372706	\N	f	f	BROUILLON	\N
\.


--
-- Data for Name: cours; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cours (id, code, nom, description, formation_id, enseignant_id, credits, duree_heures, type_cours, date_creation) FROM stdin;
f5a7a57d-2308-44ee-9986-1cf6620f4b7a	INFOOO32	MATH	Pour tous	29527e2e-d448-4ba6-825e-322345690915	c06581d1-2ebf-4a25-908e-00c198317e4f	60	10	COURS	2026-06-19 20:43:25.946302
cbb15d12-b4df-4ac6-96fc-7734d0e65d0d	INFO107	Infographie	Introduction Infographie	29527e2e-d448-4ba6-825e-322345690915	f71affa4-59ef-4ca6-b89a-9d76eba6e7e4	3	20	MIXTE	2026-06-19 20:20:48.666861
0bc6c138-502a-46b1-b702-1546320a3ea8	INFO1035	Python	Introduction python	f6ca87c1-eab0-4a6f-ae38-32787d7c75ba	f71affa4-59ef-4ca6-b89a-9d76eba6e7e4	3	60	COURS	2026-06-19 21:09:23.833214
5d657397-7a6d-4ee7-beba-e3f166186c6c	INFOO3	SPRINTBOOT	Formation sprint	ecae5a4c-559e-4f8a-83fa-35606a91bda0	fe8b2a83-e5f0-443f-b790-3f7a18591831	20	60	COURS	2026-06-20 00:08:22.317633
\.


--
-- Data for Name: diplomes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.diplomes (id, etudiant_id, formation_id, nom_diplome, date_obtention, numero_diplome, mention, note_finale, date_creation) FROM stdin;
\.


--
-- Data for Name: documents; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.documents (id, nom, description, type_document, chemin_fichier, taille_bytes, extension, proprietaire_id, communication_id, date_creation, date_modification, visible_pour_roles) FROM stdin;
\.


--
-- Data for Name: emplois_du_temps; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.emplois_du_temps (id, formation_id, cours_id, enseignant_id, jour_semaine, heure_debut, heure_fin, salle, groupe, date_debut, date_fin, statut, date_creation) FROM stdin;
\.


--
-- Data for Name: enseignants; Type: TABLE DATA; Schema: public; Owner: universite_user
--

COPY public.enseignants (id, bureau_numero, cv_url, date_embauche, diplome_supreme, grade, nom, numero_agent, prenom, specialite, statut) FROM stdin;
c06581d1-2ebf-4a25-908e-00c198317e4f	\N	\N	\N	\N	PROF	Fall	AG001	Moussa	IA	ACTIF
f71affa4-59ef-4ca6-b89a-9d76eba6e7e4	\N	\N	\N	\N	MAITRE_ASSISTANT	Mbacke	AG003	Bamba	Math	ACTIF
fe8b2a83-e5f0-443f-b790-3f7a18591831	\N	\N	\N	\N	PROF	Diallo	AG002	Oumar	Informatique	ACTIF
\.


--
-- Data for Name: etudiants; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.etudiants (id, ine, utilisateur_id, date_naissance, adresse, ville, codepostal, pays, telephone_parent, contact_urgence, formation_actuelle_id, promo, annee_debut, annee_sortie, statut, moyenne_generale, date_creation, date_modification, email, nom, prenom, formation) FROM stdin;
defb418f-d7cf-4daf-87f7-67669e134cdd	INE2026001	\N	2000-01-01	\N	\N	\N	Sénégal	\N	\N	\N	P8	2023	2026	ACTIF	\N	2026-06-11 01:09:08.441009	2026-06-11 01:09:08.441009	awa@test.com	Diallo	Awa	Informatique
006a23d4-9eca-465c-9b31-74935bf7a537	INE20260067	\N	2000-01-06	\N	\N	\N	Sénégal	\N	\N	\N	P9	2023	2026	ACTIF	\N	2026-06-15 23:46:14.397656	2026-06-15 23:46:14.397656	Bamba4@test.com	Diallo	Bamba	Audiovisuel
d0f5742a-cee7-4e0d-ae52-0fada5a81386	INE000001	4f68af60-3180-4451-87ab-f8be1534938a	2003-05-15	\N	\N	\N	Sénégal	\N	\N	44f8aea7-3895-4c64-a5d2-cb4b6da296d0	P12	2024	2026	ACTIF	\N	2026-06-10 20:06:30.935492	2026-06-10 20:06:30.935492	aliou@gmail.com	Ba	Aliou	Mathematique
\.


--
-- Data for Name: formations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.formations (id, code, nom, description, type_formation, niveau, date_debut, date_fin, duree_heures, nombre_etudiants, nombre_hommes, nombre_femmes, budget_total, type_financement, responsable_id, statut, date_creation, date_modification) FROM stdin;
44f8aea7-3895-4c64-a5d2-cb4b6da296d0	LIC-INFO-2025	Licence Informatique 2025		CERTIFICATION	MASTER	2024-09-01	2027-06-30	\N	\N	\N	\N	50000000.00	PUBLIC	\N	PLANIFIEE	2026-06-10 20:06:30.934411	2026-06-10 20:06:30.934411
ecae5a4c-559e-4f8a-83fa-35606a91bda0	Master-Math	Mathematique		DIPLÔMANTE	MASTER	2024-06-12	2026-07-03	\N	\N	\N	\N	37666.00	PUBLIC	\N	EN_COURS	2026-06-18 01:35:21.2474	2026-06-18 01:35:21.2474
f6ca87c1-eab0-4a6f-ae38-32787d7c75ba	CERT-WEB-2024	Certification Développement Web		CERTIFICATION	CERTIFICAT	2024-10-01	2025-03-31	\N	\N	\N	\N	5000000.00	PUBLIC	\N	ANNULEE	2026-06-10 20:06:30.934411	2026-06-10 20:06:30.934411
29527e2e-d448-4ba6-825e-322345690915	MASTER-IA-2024	Master Ingénierie des Applications		DIPLÔMANTE	MASTER	2024-09-15	2026-08-31	\N	\N	\N	\N	75000000.00	PUBLIC	\N	TERMINEE	2026-06-10 20:06:30.934411	2026-06-10 20:06:30.934411
\.


--
-- Data for Name: inscriptions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.inscriptions (id, etudiant_id, formation_id, date_inscription, date_debut, date_fin, statut, moyenne_formation) FROM stdin;
32c93061-a7b8-4ce6-b2fc-6c68a3db35f6	defb418f-d7cf-4daf-87f7-67669e134cdd	44f8aea7-3895-4c64-a5d2-cb4b6da296d0	2026-06-19 22:38:13.479365	\N	\N	INSCRIT	\N
e5aa3649-e9a3-4fac-8504-8e57c0e4a208	006a23d4-9eca-465c-9b31-74935bf7a537	ecae5a4c-559e-4f8a-83fa-35606a91bda0	2026-06-19 22:39:39.99576	\N	\N	INSCRIT	\N
\.


--
-- Data for Name: logs_audit; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.logs_audit (id, utilisateur_id, action, entite_type, entite_id, ancien_valeurs, nouvelles_valeurs, adresse_ip, date_action) FROM stdin;
\.


--
-- Data for Name: notifications; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.notifications (id, utilisateur_id, type_notification, titre, message, entite_type, entite_id, lu, date_creation, date_lecture) FROM stdin;
\.


--
-- Data for Name: partenaires; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.partenaires (id, nom, type_partenaire, adresse, email, telephone, contact_principal, domaines_activite, date_partenariat, statut, date_creation) FROM stdin;
\.


--
-- Data for Name: reunion_participants; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.reunion_participants (id, reunion_id, participant_id, statut_participation) FROM stdin;
\.


--
-- Data for Name: reunions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.reunions (id, titre, description, type_reunion, formation_id, organisateur_id, date_reunion, duree_minutes, lieu, statut, compte_rendu_id, date_creation) FROM stdin;
\.


--
-- Data for Name: suivi_insertion; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.suivi_insertion (id, etudiant_id, type_insertion, entreprise_nom, poste, secteur_activite, salaire_mensuel, date_debut_emploi, date_enregistrement, contact_registre, statut_inscription) FROM stdin;
\.


--
-- Data for Name: utilisateurs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.utilisateurs (id, email, mot_de_passe, nom, prenom, telephone, photo_url, role, statut, actif, date_creation, date_modification) FROM stdin;
3e0a649c-0d98-4438-aa65-8a4f87249b52	admin@universite.sn	$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36P4/KFm	Admin	Système	\N	\N	ADMIN	ACTIF	t	2026-06-10 20:06:30.933617	2026-06-10 20:06:30.933617
6482bdc3-6570-4929-826a-2e242986a428	prof@universite.sn	$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36P4/KFm	Diallo	Mamadou	\N	\N	ENSEIGNANT	ACTIF	t	2026-06-10 20:06:30.933617	2026-06-10 20:06:30.933617
4f68af60-3180-4451-87ab-f8be1534938a	etudiant@universite.sn	$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36P4/KFm	Ba	Fatou	\N	\N	ETUDIANT	ACTIF	t	2026-06-10 20:06:30.933617	2026-06-10 20:06:30.933617
7442f53a-7920-48bd-b77f-87f4339324b1	abdou@test.com	$2a$10$F9aeDUxsEF7jTJTywtTOke41kRx4xhGextG.k4IZqOn/EgMKUXrTi	Mbacke	Abdoulaye	\N	\N	ETUDIANT	ACTIF	t	2026-06-10 20:36:57.544146	2026-06-10 20:36:57.544251
b8c66d56-2b84-4c39-80a8-33663e77a39e	test@gmail.com	$2a$10$V3JyT1N84LB.G8zkHkz.z.HGP9CcD74lTnfIZk3byEB.2E063Vebu	Diallo	Awa	\N	\N	ETUDIANT	ACTIF	t	2026-06-11 00:14:03.998691	2026-06-11 00:14:03.998722
7dbb275f-8489-4f33-a859-1861bb6ab708	test3@gmail.com	$2a$10$e6KA1Ql9JEkHw0teKoT65.3oOHmsblQh8t67oSxd8Q54yVX1DVHim	Diallo	Awa	\N	\N	ETUDIANT	ACTIF	t	2026-06-11 00:22:36.439795	2026-06-11 00:22:36.439814
6c16dc8d-d9d5-423a-8d9f-5309480ac450	test6@gmail.com	$2a$10$nAxUWXwX23MkTAGFtLnxu.yyHW5YLIBReBpdX7vPsVQCVixm1iHCe	Diallo	Awa	\N	\N	ETUDIANT	ACTIF	t	2026-06-11 00:37:50.201821	2026-06-11 00:37:50.201842
c3207c7f-bd17-4e29-a869-13f5d5cdf84f	test7@gmail.com	$2a$10$UMEmJfzf4oHKCpH1vRMTc.nZm8kE5O/uufvo2w6AoSYD.YvNZx2GO	Diallo	Awa	\N	\N	ETUDIANT	ACTIF	t	2026-06-11 00:42:02.320052	2026-06-11 00:42:02.320069
e5a445cd-331d-42fc-b990-12a91af3f05c	test8@gmail.com	$2a$10$IcnXngE62bFuuo1IdaUfqOlX.qsSXyrQrjvhGfuBvU2r1lu1w4s7C	Diallo	Awa	\N	\N	ETUDIANT	ACTIF	t	2026-06-11 00:43:09.13902	2026-06-11 00:43:09.139069
97a78cc3-e4f5-4240-a1d0-9f70b19c04a0	test9@gmail.com	$2a$10$j0BTifWjPjdIZw8ulsCq2ulfyF5QVmHPkRDN6zVSvS.aVw4c3OqAq	Diallo	Awa	\N	\N	ETUDIANT	\N	t	2026-06-15 23:32:06.484893	2026-06-15 23:32:06.484893
802dd0b2-a815-4916-a6ae-7a64852f380a	admin2@universite.sn	$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36P4/KFm	Ndiaye	Ousmane	\N	\N	ADMIN	ACTIF	t	2026-06-10 20:06:30.933617	2026-06-10 20:06:30.933617
df156b5d-aed2-4c1b-954d-c26b815eec04	admin5@universite.sn	$2a$10$8//OimZX0UChDfqObxtY..QsMLky4BuutjjxpNMCVkBn5fAlm4toa	Admin	Systeme	\N	\N	ADMIN	ACTIF	t	2026-06-16 03:04:35.118056	2026-06-16 03:04:35.118056
047926b3-c2f5-4dcc-88a6-2b5ab19bd8f2	Enseignant1@universite.sn	$2a$10$boc455M2KZ3fWxfuJhDauu9Att2ZZhzwfKVOUMDK2ZsR.v.4RD5vS	Enseignant	Systeme	\N	\N	ETUDIANT	ACTIF	t	2026-06-19 23:01:03.530521	2026-06-19 23:01:03.530521
64e9781c-923f-4be3-b7c2-d2cb0179be21	mbackeboune@gmail.com	$2a$10$mn4iuMAVMTFEYDF1mMNtru9JwHk7GgaEkAVlrij3Mjj4x5hP7sNzi	Mbacke	Abdallah	\N	\N	ETUDIANT	ACTIF	t	2026-06-19 23:30:15.662228	2026-06-19 23:30:15.662228
6f8e7c18-9768-46ef-96ad-dc8a6ae0a2c3	mbacke@universite.sn	$2a$10$I.ufLwAE87B.VMWamGrRkOL4HOFAWEM6.g6.9CluZfdkIKpu1vuRa	Mbacke	Abdou	\N	\N	ETUDIANT	ACTIF	t	2026-06-19 23:37:26.501123	2026-06-19 23:37:26.501123
4acc2928-6095-456b-b578-a0a6d94d0621	mbackeboune@universite.com	$2a$10$.P5LLJ0k6aj/VlcMEqMG/uCYRhgC0mpuK0UMkg2DUVlVcGb3qxxPW	Mbacke	Boune Abdoulaye	\N	\N	ENSEIGNANT	ACTIF	t	2026-06-20 00:05:11.756662	2026-06-20 00:05:11.756662
\.


--
-- Name: affectations_enseignants affectations_enseignants_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.affectations_enseignants
    ADD CONSTRAINT affectations_enseignants_pkey PRIMARY KEY (id);


--
-- Name: autres_formations autres_formations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.autres_formations
    ADD CONSTRAINT autres_formations_pkey PRIMARY KEY (id);


--
-- Name: bilans_stages bilans_stages_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bilans_stages
    ADD CONSTRAINT bilans_stages_pkey PRIMARY KEY (id);


--
-- Name: budgets budgets_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.budgets
    ADD CONSTRAINT budgets_pkey PRIMARY KEY (id);


--
-- Name: communications communications_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.communications
    ADD CONSTRAINT communications_pkey PRIMARY KEY (id);


--
-- Name: cours cours_code_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cours
    ADD CONSTRAINT cours_code_key UNIQUE (code);


--
-- Name: cours cours_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cours
    ADD CONSTRAINT cours_pkey PRIMARY KEY (id);


--
-- Name: diplomes diplomes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.diplomes
    ADD CONSTRAINT diplomes_pkey PRIMARY KEY (id);


--
-- Name: documents documents_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.documents
    ADD CONSTRAINT documents_pkey PRIMARY KEY (id);


--
-- Name: emplois_du_temps emplois_du_temps_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.emplois_du_temps
    ADD CONSTRAINT emplois_du_temps_pkey PRIMARY KEY (id);


--
-- Name: enseignants enseignants_pkey; Type: CONSTRAINT; Schema: public; Owner: universite_user
--

ALTER TABLE ONLY public.enseignants
    ADD CONSTRAINT enseignants_pkey PRIMARY KEY (id);


--
-- Name: etudiants etudiants_ine_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.etudiants
    ADD CONSTRAINT etudiants_ine_key UNIQUE (ine);


--
-- Name: etudiants etudiants_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.etudiants
    ADD CONSTRAINT etudiants_pkey PRIMARY KEY (id);


--
-- Name: etudiants etudiants_utilisateur_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.etudiants
    ADD CONSTRAINT etudiants_utilisateur_id_key UNIQUE (utilisateur_id);


--
-- Name: formations formations_code_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.formations
    ADD CONSTRAINT formations_code_key UNIQUE (code);


--
-- Name: formations formations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.formations
    ADD CONSTRAINT formations_pkey PRIMARY KEY (id);


--
-- Name: inscriptions inscriptions_etudiant_id_formation_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inscriptions
    ADD CONSTRAINT inscriptions_etudiant_id_formation_id_key UNIQUE (etudiant_id, formation_id);


--
-- Name: inscriptions inscriptions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inscriptions
    ADD CONSTRAINT inscriptions_pkey PRIMARY KEY (id);


--
-- Name: logs_audit logs_audit_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.logs_audit
    ADD CONSTRAINT logs_audit_pkey PRIMARY KEY (id);


--
-- Name: notifications notifications_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_pkey PRIMARY KEY (id);


--
-- Name: partenaires partenaires_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.partenaires
    ADD CONSTRAINT partenaires_pkey PRIMARY KEY (id);


--
-- Name: reunion_participants reunion_participants_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reunion_participants
    ADD CONSTRAINT reunion_participants_pkey PRIMARY KEY (id);


--
-- Name: reunion_participants reunion_participants_reunion_id_participant_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reunion_participants
    ADD CONSTRAINT reunion_participants_reunion_id_participant_id_key UNIQUE (reunion_id, participant_id);


--
-- Name: reunions reunions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reunions
    ADD CONSTRAINT reunions_pkey PRIMARY KEY (id);


--
-- Name: suivi_insertion suivi_insertion_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.suivi_insertion
    ADD CONSTRAINT suivi_insertion_pkey PRIMARY KEY (id);


--
-- Name: enseignants uk_i7n57e62nhusnhfjegn2m5cbr; Type: CONSTRAINT; Schema: public; Owner: universite_user
--

ALTER TABLE ONLY public.enseignants
    ADD CONSTRAINT uk_i7n57e62nhusnhfjegn2m5cbr UNIQUE (numero_agent);


--
-- Name: utilisateurs utilisateurs_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.utilisateurs
    ADD CONSTRAINT utilisateurs_email_key UNIQUE (email);


--
-- Name: utilisateurs utilisateurs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.utilisateurs
    ADD CONSTRAINT utilisateurs_pkey PRIMARY KEY (id);


--
-- Name: idx_affectations_enseignant; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_affectations_enseignant ON public.affectations_enseignants USING btree (enseignant_id);


--
-- Name: idx_affectations_formation; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_affectations_formation ON public.affectations_enseignants USING btree (formation_id);


--
-- Name: idx_autres_form_etudiant; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_autres_form_etudiant ON public.autres_formations USING btree (etudiant_id);


--
-- Name: idx_bilans_etudiant; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_bilans_etudiant ON public.bilans_stages USING btree (etudiant_id);


--
-- Name: idx_bilans_partenaire; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_bilans_partenaire ON public.bilans_stages USING btree (partenaire_id);


--
-- Name: idx_budgets_annee; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_budgets_annee ON public.budgets USING btree (annee_budgetaire);


--
-- Name: idx_budgets_formation; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_budgets_formation ON public.budgets USING btree (formation_id);


--
-- Name: idx_communications_auteur; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_communications_auteur ON public.communications USING btree (auteur_id);


--
-- Name: idx_communications_date; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_communications_date ON public.communications USING btree (date_creation);


--
-- Name: idx_communications_type; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_communications_type ON public.communications USING btree (type_communication);


--
-- Name: idx_cours_enseignant; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_cours_enseignant ON public.cours USING btree (enseignant_id);


--
-- Name: idx_cours_formation; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_cours_formation ON public.cours USING btree (formation_id);


--
-- Name: idx_diplomes_date; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_diplomes_date ON public.diplomes USING btree (date_obtention);


--
-- Name: idx_diplomes_etudiant; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_diplomes_etudiant ON public.diplomes USING btree (etudiant_id);


--
-- Name: idx_documents_date; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_documents_date ON public.documents USING btree (date_creation);


--
-- Name: idx_documents_proprietaire; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_documents_proprietaire ON public.documents USING btree (proprietaire_id);


--
-- Name: idx_documents_type; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_documents_type ON public.documents USING btree (type_document);


--
-- Name: idx_emplois_formation; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_emplois_formation ON public.emplois_du_temps USING btree (formation_id);


--
-- Name: idx_emplois_jour; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_emplois_jour ON public.emplois_du_temps USING btree (jour_semaine);


--
-- Name: idx_etudiants_formation; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_etudiants_formation ON public.etudiants USING btree (formation_actuelle_id);


--
-- Name: idx_etudiants_ine; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_etudiants_ine ON public.etudiants USING btree (ine);


--
-- Name: idx_etudiants_statut; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_etudiants_statut ON public.etudiants USING btree (statut);


--
-- Name: idx_formations_code; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_formations_code ON public.formations USING btree (code);


--
-- Name: idx_formations_responsable; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_formations_responsable ON public.formations USING btree (responsable_id);


--
-- Name: idx_formations_statut; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_formations_statut ON public.formations USING btree (statut);


--
-- Name: idx_inscriptions_etudiant; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_inscriptions_etudiant ON public.inscriptions USING btree (etudiant_id);


--
-- Name: idx_inscriptions_formation; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_inscriptions_formation ON public.inscriptions USING btree (formation_id);


--
-- Name: idx_insertion_etudiant; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_insertion_etudiant ON public.suivi_insertion USING btree (etudiant_id);


--
-- Name: idx_insertion_type; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_insertion_type ON public.suivi_insertion USING btree (type_insertion);


--
-- Name: idx_logs_date; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_logs_date ON public.logs_audit USING btree (date_action);


--
-- Name: idx_logs_utilisateur; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_logs_utilisateur ON public.logs_audit USING btree (utilisateur_id);


--
-- Name: idx_notifications_date; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_notifications_date ON public.notifications USING btree (date_creation);


--
-- Name: idx_notifications_lu; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_notifications_lu ON public.notifications USING btree (lu);


--
-- Name: idx_notifications_utilisateur; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_notifications_utilisateur ON public.notifications USING btree (utilisateur_id);


--
-- Name: idx_partenaires_statut; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_partenaires_statut ON public.partenaires USING btree (statut);


--
-- Name: idx_partenaires_type; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_partenaires_type ON public.partenaires USING btree (type_partenaire);


--
-- Name: idx_reunion_part_participant; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_reunion_part_participant ON public.reunion_participants USING btree (participant_id);


--
-- Name: idx_reunion_part_reunion; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_reunion_part_reunion ON public.reunion_participants USING btree (reunion_id);


--
-- Name: idx_reunions_date; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_reunions_date ON public.reunions USING btree (date_reunion);


--
-- Name: idx_reunions_formation; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_reunions_formation ON public.reunions USING btree (formation_id);


--
-- Name: idx_reunions_type; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_reunions_type ON public.reunions USING btree (type_reunion);


--
-- Name: idx_utilisateurs_email; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_utilisateurs_email ON public.utilisateurs USING btree (email);


--
-- Name: idx_utilisateurs_role; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_utilisateurs_role ON public.utilisateurs USING btree (role);


--
-- Name: affectations_enseignants affectations_enseignants_formation_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.affectations_enseignants
    ADD CONSTRAINT affectations_enseignants_formation_id_fkey FOREIGN KEY (formation_id) REFERENCES public.formations(id) ON DELETE CASCADE;


--
-- Name: autres_formations autres_formations_etudiant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.autres_formations
    ADD CONSTRAINT autres_formations_etudiant_id_fkey FOREIGN KEY (etudiant_id) REFERENCES public.etudiants(id) ON DELETE CASCADE;


--
-- Name: bilans_stages bilans_stages_etudiant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bilans_stages
    ADD CONSTRAINT bilans_stages_etudiant_id_fkey FOREIGN KEY (etudiant_id) REFERENCES public.etudiants(id) ON DELETE CASCADE;


--
-- Name: bilans_stages bilans_stages_partenaire_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bilans_stages
    ADD CONSTRAINT bilans_stages_partenaire_id_fkey FOREIGN KEY (partenaire_id) REFERENCES public.partenaires(id);


--
-- Name: budgets budgets_formation_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.budgets
    ADD CONSTRAINT budgets_formation_id_fkey FOREIGN KEY (formation_id) REFERENCES public.formations(id);


--
-- Name: budgets budgets_responsable_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.budgets
    ADD CONSTRAINT budgets_responsable_id_fkey FOREIGN KEY (responsable_id) REFERENCES public.utilisateurs(id);


--
-- Name: communications communications_auteur_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.communications
    ADD CONSTRAINT communications_auteur_id_fkey FOREIGN KEY (auteur_id) REFERENCES public.utilisateurs(id);


--
-- Name: cours cours_formation_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cours
    ADD CONSTRAINT cours_formation_id_fkey FOREIGN KEY (formation_id) REFERENCES public.formations(id) ON DELETE CASCADE;


--
-- Name: diplomes diplomes_etudiant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.diplomes
    ADD CONSTRAINT diplomes_etudiant_id_fkey FOREIGN KEY (etudiant_id) REFERENCES public.etudiants(id) ON DELETE CASCADE;


--
-- Name: diplomes diplomes_formation_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.diplomes
    ADD CONSTRAINT diplomes_formation_id_fkey FOREIGN KEY (formation_id) REFERENCES public.formations(id);


--
-- Name: documents documents_communication_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.documents
    ADD CONSTRAINT documents_communication_id_fkey FOREIGN KEY (communication_id) REFERENCES public.communications(id);


--
-- Name: documents documents_proprietaire_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.documents
    ADD CONSTRAINT documents_proprietaire_id_fkey FOREIGN KEY (proprietaire_id) REFERENCES public.utilisateurs(id);


--
-- Name: emplois_du_temps emplois_du_temps_cours_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.emplois_du_temps
    ADD CONSTRAINT emplois_du_temps_cours_id_fkey FOREIGN KEY (cours_id) REFERENCES public.cours(id);


--
-- Name: emplois_du_temps emplois_du_temps_formation_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.emplois_du_temps
    ADD CONSTRAINT emplois_du_temps_formation_id_fkey FOREIGN KEY (formation_id) REFERENCES public.formations(id) ON DELETE CASCADE;


--
-- Name: etudiants etudiants_formation_actuelle_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.etudiants
    ADD CONSTRAINT etudiants_formation_actuelle_id_fkey FOREIGN KEY (formation_actuelle_id) REFERENCES public.formations(id);


--
-- Name: etudiants etudiants_utilisateur_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.etudiants
    ADD CONSTRAINT etudiants_utilisateur_id_fkey FOREIGN KEY (utilisateur_id) REFERENCES public.utilisateurs(id) ON DELETE CASCADE;


--
-- Name: formations formations_responsable_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.formations
    ADD CONSTRAINT formations_responsable_id_fkey FOREIGN KEY (responsable_id) REFERENCES public.utilisateurs(id);


--
-- Name: inscriptions inscriptions_etudiant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inscriptions
    ADD CONSTRAINT inscriptions_etudiant_id_fkey FOREIGN KEY (etudiant_id) REFERENCES public.etudiants(id) ON DELETE CASCADE;


--
-- Name: inscriptions inscriptions_formation_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inscriptions
    ADD CONSTRAINT inscriptions_formation_id_fkey FOREIGN KEY (formation_id) REFERENCES public.formations(id) ON DELETE CASCADE;


--
-- Name: logs_audit logs_audit_utilisateur_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.logs_audit
    ADD CONSTRAINT logs_audit_utilisateur_id_fkey FOREIGN KEY (utilisateur_id) REFERENCES public.utilisateurs(id);


--
-- Name: notifications notifications_utilisateur_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_utilisateur_id_fkey FOREIGN KEY (utilisateur_id) REFERENCES public.utilisateurs(id) ON DELETE CASCADE;


--
-- Name: reunion_participants reunion_participants_participant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reunion_participants
    ADD CONSTRAINT reunion_participants_participant_id_fkey FOREIGN KEY (participant_id) REFERENCES public.utilisateurs(id) ON DELETE CASCADE;


--
-- Name: reunion_participants reunion_participants_reunion_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reunion_participants
    ADD CONSTRAINT reunion_participants_reunion_id_fkey FOREIGN KEY (reunion_id) REFERENCES public.reunions(id) ON DELETE CASCADE;


--
-- Name: reunions reunions_compte_rendu_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reunions
    ADD CONSTRAINT reunions_compte_rendu_id_fkey FOREIGN KEY (compte_rendu_id) REFERENCES public.communications(id);


--
-- Name: reunions reunions_formation_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reunions
    ADD CONSTRAINT reunions_formation_id_fkey FOREIGN KEY (formation_id) REFERENCES public.formations(id);


--
-- Name: reunions reunions_organisateur_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reunions
    ADD CONSTRAINT reunions_organisateur_id_fkey FOREIGN KEY (organisateur_id) REFERENCES public.utilisateurs(id);


--
-- Name: suivi_insertion suivi_insertion_etudiant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.suivi_insertion
    ADD CONSTRAINT suivi_insertion_etudiant_id_fkey FOREIGN KEY (etudiant_id) REFERENCES public.etudiants(id) ON DELETE CASCADE;


--
-- Name: TABLE affectations_enseignants; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.affectations_enseignants TO universite_user;


--
-- Name: TABLE autres_formations; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.autres_formations TO universite_user;


--
-- Name: TABLE bilans_stages; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.bilans_stages TO universite_user;


--
-- Name: TABLE budgets; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.budgets TO universite_user;


--
-- Name: TABLE communications; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.communications TO universite_user;


--
-- Name: TABLE cours; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.cours TO universite_user;


--
-- Name: TABLE diplomes; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.diplomes TO universite_user;


--
-- Name: TABLE documents; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.documents TO universite_user;


--
-- Name: TABLE emplois_du_temps; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.emplois_du_temps TO universite_user;


--
-- Name: TABLE etudiants; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.etudiants TO universite_user;


--
-- Name: TABLE formations; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.formations TO universite_user;


--
-- Name: TABLE inscriptions; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.inscriptions TO universite_user;


--
-- Name: TABLE logs_audit; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.logs_audit TO universite_user;


--
-- Name: TABLE notifications; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.notifications TO universite_user;


--
-- Name: TABLE partenaires; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.partenaires TO universite_user;


--
-- Name: TABLE reunion_participants; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.reunion_participants TO universite_user;


--
-- Name: TABLE reunions; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.reunions TO universite_user;


--
-- Name: TABLE suivi_insertion; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.suivi_insertion TO universite_user;


--
-- Name: TABLE utilisateurs; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.utilisateurs TO universite_user;


--
-- PostgreSQL database dump complete
--

\unrestrict hvDkrGDP9Ed0k1XnSgCud5MU3nsmEbeNC2nxEOfkujGgtEYdfLGbDSAwIEW6C85

