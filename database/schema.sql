-- ============================================================
-- SCHÉMA COMPLÈTE POUR UNIVERSITAIRE
-- Base de données: universite_db
-- SGBD: PostgreSQL 13+
-- ============================================================

-- Extension UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- 1. TABLE UTILISATEURS (Base)
-- ============================================================
CREATE TABLE utilisateurs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    mot_de_passe VARCHAR(255) NOT NULL,
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    telephone VARCHAR(20),
    photo_url VARCHAR(500),
    role VARCHAR(50) NOT NULL CHECK (role IN ('ADMIN', 'ADMINISTRATIF', 'ENSEIGNANT', 'ENSEIGNANT_ASSOCIE', 'RESPONSABLE_FORMATION', 'TUTEUR', 'APPUI_INSERTION', 'ETUDIANT')),
    statut VARCHAR(20) DEFAULT 'ACTIF' CHECK (statut IN ('ACTIF', 'INACTIF', 'SUSPENDU')),
    actif BOOLEAN DEFAULT TRUE,
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    date_modification TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_utilisateurs_email ON utilisateurs(email);
CREATE INDEX idx_utilisateurs_role ON utilisateurs(role);

-- ============================================================
-- 2. TABLE FORMATIONS
-- ============================================================
CREATE TABLE formations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(20) UNIQUE NOT NULL,
    nom VARCHAR(255) NOT NULL,
    description TEXT,
    type_formation VARCHAR(100) NOT NULL CHECK (type_formation IN ('DIPLÔMANTE', 'CERTIFICATION', 'COURTE', 'LONGUE')),
    niveau VARCHAR(50) NOT NULL CHECK (niveau IN ('LICENCE', 'MASTER', 'DOCTORAT', 'CERTIFICAT', 'COURTE DURÉE')),
    date_debut DATE NOT NULL,
    date_fin DATE NOT NULL,
    duree_heures INTEGER,
    nombre_etudiants INTEGER DEFAULT 0,
    nombre_hommes INTEGER DEFAULT 0,
    nombre_femmes INTEGER DEFAULT 0,
    budget_total DECIMAL(12, 2) DEFAULT 0,
    type_financement VARCHAR(100),
    responsable_id UUID REFERENCES utilisateurs(id),
    statut VARCHAR(20) DEFAULT 'PLANIFIÉE' CHECK (statut IN ('PLANIFIÉE', 'EN_COURS', 'TERMINÉE', 'ANNULÉE')),
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    date_modification TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_formations_code ON formations(code);
CREATE INDEX idx_formations_responsable ON formations(responsable_id);
CREATE INDEX idx_formations_statut ON formations(statut);

-- ============================================================
-- 3. TABLE ÉTUDIANTS
-- ============================================================
CREATE TABLE etudiants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ine VARCHAR(20) UNIQUE NOT NULL,
    utilisateur_id UUID UNIQUE REFERENCES utilisateurs(id) ON DELETE CASCADE,
    date_naissance DATE,
    adresse VARCHAR(255),
    ville VARCHAR(100),
    codepostal VARCHAR(10),
    pays VARCHAR(100) DEFAULT 'Sénégal',
    telephone_parent VARCHAR(20),
    contact_urgence VARCHAR(255),
    formation_actuelle_id UUID REFERENCES formations(id),
    promo INTEGER,
    annee_debut INTEGER,
    annee_sortie INTEGER,
    statut VARCHAR(50) DEFAULT 'ACTIF' CHECK (statut IN ('ACTIF', 'SUSPENDU', 'DIPLÔMÉ', 'RETIRÉ')),
    moyenne_generale DECIMAL(4, 2),
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    date_modification TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_etudiants_ine ON etudiants(ine);
CREATE INDEX idx_etudiants_formation ON etudiants(formation_actuelle_id);
CREATE INDEX idx_etudiants_statut ON etudiants(statut);

-- ============================================================
-- 4. TABLE INSCRIPTIONS (Étudiants -> Formations)
-- ============================================================
CREATE TABLE inscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    etudiant_id UUID NOT NULL REFERENCES etudiants(id) ON DELETE CASCADE,
    formation_id UUID NOT NULL REFERENCES formations(id) ON DELETE CASCADE,
    date_inscription TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    date_debut DATE,
    date_fin DATE,
    statut VARCHAR(50) DEFAULT 'INSCRIT' CHECK (statut IN ('INSCRIT', 'SUSPENDU', 'DIPLÔMÉ', 'RETIRÉ')),
    moyenne_formation DECIMAL(4, 2),
    UNIQUE(etudiant_id, formation_id)
);

CREATE INDEX idx_inscriptions_etudiant ON inscriptions(etudiant_id);
CREATE INDEX idx_inscriptions_formation ON inscriptions(formation_id);

-- ============================================================
-- 5. TABLE DIPLÔMES
-- ============================================================
CREATE TABLE diplomes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    etudiant_id UUID NOT NULL REFERENCES etudiants(id) ON DELETE CASCADE,
    formation_id UUID NOT NULL REFERENCES formations(id),
    nom_diplome VARCHAR(255) NOT NULL,
    date_obtention DATE NOT NULL,
    numero_diplome VARCHAR(50),
    mention VARCHAR(100),
    note_finale DECIMAL(4, 2),
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_diplomes_etudiant ON diplomes(etudiant_id);
CREATE INDEX idx_diplomes_date ON diplomes(date_obtention);

-- ============================================================
-- 6. TABLE ENSEIGNANTS
-- ============================================================
CREATE TABLE enseignants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    utilisateur_id UUID UNIQUE REFERENCES utilisateurs(id) ON DELETE CASCADE,
    numero_agent VARCHAR(50) UNIQUE,
    specialite VARCHAR(255),
    grade VARCHAR(100),
    diplome_supreme VARCHAR(255),
    date_embauche DATE,
    bureau_numero VARCHAR(50),
    cv_url VARCHAR(500),
    statut VARCHAR(50) DEFAULT 'PERMANENT' CHECK (statut IN ('PERMANENT', 'ASSOCIÉ', 'VACATAIRE', 'CONTRACTUEL')),
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_enseignants_utilisateur ON enseignants(utilisateur_id);
CREATE INDEX idx_enseignants_statut ON enseignants(statut);

-- ============================================================
-- 7. TABLE AFFECTATIONS ENSEIGNANTS -> FORMATIONS
-- ============================================================
CREATE TABLE affectations_enseignants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    enseignant_id UUID NOT NULL REFERENCES enseignants(id) ON DELETE CASCADE,
    formation_id UUID NOT NULL REFERENCES formations(id) ON DELETE CASCADE,
    role VARCHAR(100) CHECK (role IN ('COORDINATEUR', 'ENSEIGNANT', 'TUTEUR', 'RESPONSABLE')),
    date_debut DATE,
    date_fin DATE,
    heures_prevues INTEGER,
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_affectations_enseignant ON affectations_enseignants(enseignant_id);
CREATE INDEX idx_affectations_formation ON affectations_enseignants(formation_id);

-- ============================================================
-- 8. TABLE COURS
-- ============================================================
CREATE TABLE cours (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(20) UNIQUE NOT NULL,
    nom VARCHAR(255) NOT NULL,
    description TEXT,
    formation_id UUID NOT NULL REFERENCES formations(id) ON DELETE CASCADE,
    enseignant_id UUID REFERENCES enseignants(id),
    credits INTEGER DEFAULT 3,
    duree_heures INTEGER,
    type_cours VARCHAR(50) CHECK (type_cours IN ('THEORIQUE', 'PRATIQUE', 'MIXTE')),
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_cours_formation ON cours(formation_id);
CREATE INDEX idx_cours_enseignant ON cours(enseignant_id);

-- ============================================================
-- 9. TABLE EMPLOI DU TEMPS
-- ============================================================
CREATE TABLE emplois_du_temps (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    formation_id UUID NOT NULL REFERENCES formations(id) ON DELETE CASCADE,
    cours_id UUID REFERENCES cours(id),
    enseignant_id UUID REFERENCES enseignants(id),
    jour_semaine VARCHAR(20) NOT NULL CHECK (jour_semaine IN ('LUNDI', 'MARDI', 'MERCREDI', 'JEUDI', 'VENDREDI', 'SAMEDI')),
    heure_debut TIME NOT NULL,
    heure_fin TIME NOT NULL,
    salle VARCHAR(50),
    groupe VARCHAR(50),
    date_debut DATE,
    date_fin DATE,
    statut VARCHAR(20) DEFAULT 'PLANIFIÉ' CHECK (statut IN ('PLANIFIÉ', 'EN_COURS', 'TERMINÉ', 'ANNULÉ')),
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_emplois_formation ON emplois_du_temps(formation_id);
CREATE INDEX idx_emplois_jour ON emplois_du_temps(jour_semaine);

-- ============================================================
-- 10. TABLE COMMUNICATIONS
-- ============================================================
CREATE TABLE communications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    titre VARCHAR(255) NOT NULL,
    contenu TEXT NOT NULL,
    type_communication VARCHAR(100) NOT NULL CHECK (type_communication IN ('COMPTE_RENDU', 'CIRCULAIRE', 'REUNION', 'SEMINAIRE', 'WEBINAIRE', 'CONSEIL')),
    auteur_id UUID NOT NULL REFERENCES utilisateurs(id),
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    date_modification TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    date_publication TIMESTAMP,
    visible_au_public BOOLEAN DEFAULT FALSE,
    archivee BOOLEAN DEFAULT FALSE
);

CREATE INDEX idx_communications_auteur ON communications(auteur_id);
CREATE INDEX idx_communications_type ON communications(type_communication);
CREATE INDEX idx_communications_date ON communications(date_creation);

-- ============================================================
-- 11. TABLE DOCUMENTS
-- ============================================================
CREATE TABLE documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nom VARCHAR(255) NOT NULL,
    description TEXT,
    type_document VARCHAR(100) NOT NULL CHECK (type_document IN ('COURRIER_ARRIVEE', 'COURRIER_DEPART', 'NOTE_SERVICE', 'NOTE_ADMINISTRATIVE', 'CIRCULAIRE', 'RAPPORT', 'CONTRAT', 'AUTRE')),
    chemin_fichier VARCHAR(500) NOT NULL,
    taille_bytes BIGINT,
    extension VARCHAR(10),
    proprietaire_id UUID REFERENCES utilisateurs(id),
    communication_id UUID REFERENCES communications(id),
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    date_modification TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    visible_pour_roles TEXT
);

CREATE INDEX idx_documents_type ON documents(type_document);
CREATE INDEX idx_documents_proprietaire ON documents(proprietaire_id);
CREATE INDEX idx_documents_date ON documents(date_creation);

-- ============================================================
-- 12. TABLE BUDGETS
-- ============================================================
CREATE TABLE budgets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    annee_budgetaire INTEGER NOT NULL,
    formation_id UUID REFERENCES formations(id),
    budget_previsionnel DECIMAL(12, 2) NOT NULL,
    budget_realise DECIMAL(12, 2) DEFAULT 0,
    note_orientation TEXT,
    responsable_id UUID REFERENCES utilisateurs(id),
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    date_modification TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_budgets_annee ON budgets(annee_budgetaire);
CREATE INDEX idx_budgets_formation ON budgets(formation_id);

-- ============================================================
-- 13. TABLE SUIVI INSERTION
-- ============================================================
CREATE TABLE suivi_insertion (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    etudiant_id UUID NOT NULL REFERENCES etudiants(id) ON DELETE CASCADE,
    type_insertion VARCHAR(100) NOT NULL CHECK (type_insertion IN ('AUTO_EMPLOI', 'EMPLOI_SALARIE', 'POURSUITE_ETUDES', 'RECHERCHE')),
    entreprise_nom VARCHAR(255),
    poste VARCHAR(255),
    secteur_activite VARCHAR(100),
    salaire_mensuel DECIMAL(10, 2),
    date_debut_emploi DATE,
    date_enregistrement TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    contact_registre VARCHAR(255),
    statut_inscription VARCHAR(50) DEFAULT 'ENREGISTRÉ'
);

CREATE INDEX idx_insertion_etudiant ON suivi_insertion(etudiant_id);
CREATE INDEX idx_insertion_type ON suivi_insertion(type_insertion);

-- ============================================================
-- 14. TABLE PARTENAIRES
-- ============================================================
CREATE TABLE partenaires (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nom VARCHAR(255) NOT NULL,
    type_partenaire VARCHAR(100) CHECK (type_partenaire IN ('ENTREPRISE', 'ONG', 'GOUVERNEMENTAL', 'EDUCATIONAL', 'FINANCIER')),
    adresse VARCHAR(255),
    email VARCHAR(255),
    telephone VARCHAR(20),
    contact_principal VARCHAR(255),
    domaines_activite VARCHAR(500),
    date_partenariat DATE,
    statut VARCHAR(50) DEFAULT 'ACTIF' CHECK (statut IN ('ACTIF', 'INACTIF', 'SUSPENDU')),
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_partenaires_type ON partenaires(type_partenaire);
CREATE INDEX idx_partenaires_statut ON partenaires(statut);

-- ============================================================
-- 15. TABLE BILANS DE STAGE
-- ============================================================
CREATE TABLE bilans_stages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    etudiant_id UUID NOT NULL REFERENCES etudiants(id) ON DELETE CASCADE,
    partenaire_id UUID REFERENCES partenaires(id),
    date_debut_stage DATE NOT NULL,
    date_fin_stage DATE NOT NULL,
    description_activites TEXT,
    competences_acquises TEXT,
    note_stage DECIMAL(4, 2),
    rapport_url VARCHAR(500),
    superviseur_nom VARCHAR(255),
    superviseur_email VARCHAR(255),
    statut VARCHAR(50) DEFAULT 'EN_COURS' CHECK (statut IN ('EN_COURS', 'VALIDÉ', 'REJETÉ')),
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_bilans_etudiant ON bilans_stages(etudiant_id);
CREATE INDEX idx_bilans_partenaire ON bilans_stages(partenaire_id);

-- ============================================================
-- 16. TABLE RÉUNIONS
-- ============================================================
CREATE TABLE reunions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    titre VARCHAR(255) NOT NULL,
    description TEXT,
    type_reunion VARCHAR(100) NOT NULL CHECK (type_reunion IN ('TUTORAT', 'PREPARATION_COURS', 'EVALUATION', 'ADMINISTRATIVE', 'PEDAGOGIQUE')),
    formation_id UUID REFERENCES formations(id),
    organisateur_id UUID NOT NULL REFERENCES utilisateurs(id),
    date_reunion TIMESTAMP NOT NULL,
    duree_minutes INTEGER DEFAULT 60,
    lieu VARCHAR(255),
    statut VARCHAR(50) DEFAULT 'PLANIFIÉE' CHECK (statut IN ('PLANIFIÉE', 'EN_COURS', 'TERMINÉE', 'ANNULÉE')),
    compte_rendu_id UUID REFERENCES communications(id),
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_reunions_formation ON reunions(formation_id);
CREATE INDEX idx_reunions_date ON reunions(date_reunion);
CREATE INDEX idx_reunions_type ON reunions(type_reunion);

-- ============================================================
-- 17. TABLE PARTICIPANTS RÉUNIONS (Many-to-Many)
-- ============================================================
CREATE TABLE reunion_participants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    reunion_id UUID NOT NULL REFERENCES reunions(id) ON DELETE CASCADE,
    participant_id UUID NOT NULL REFERENCES utilisateurs(id) ON DELETE CASCADE,
    statut_participation VARCHAR(50) DEFAULT 'INVITÉ' CHECK (statut_participation IN ('INVITÉ', 'CONFIRMÉ', 'ABSENT', 'PRÉSENT')),
    UNIQUE(reunion_id, participant_id)
);

CREATE INDEX idx_reunion_part_reunion ON reunion_participants(reunion_id);
CREATE INDEX idx_reunion_part_participant ON reunion_participants(participant_id);

-- ============================================================
-- 18. TABLE NOTIFICATIONS
-- ============================================================
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    utilisateur_id UUID NOT NULL REFERENCES utilisateurs(id) ON DELETE CASCADE,
    type_notification VARCHAR(100),
    titre VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    entite_type VARCHAR(100),
    entite_id UUID,
    lu BOOLEAN DEFAULT FALSE,
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    date_lecture TIMESTAMP
);

CREATE INDEX idx_notifications_utilisateur ON notifications(utilisateur_id);
CREATE INDEX idx_notifications_lu ON notifications(lu);
CREATE INDEX idx_notifications_date ON notifications(date_creation);

-- ============================================================
-- 19. TABLE LOGS D'AUDIT
-- ============================================================
CREATE TABLE logs_audit (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    utilisateur_id UUID REFERENCES utilisateurs(id),
    action VARCHAR(100) NOT NULL,
    entite_type VARCHAR(100),
    entite_id UUID,
    ancien_valeurs JSONB,
    nouvelles_valeurs JSONB,
    adresse_ip VARCHAR(50),
    date_action TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_logs_utilisateur ON logs_audit(utilisateur_id);
CREATE INDEX idx_logs_date ON logs_audit(date_action);

-- ============================================================
-- 20. TABLE AUTRES FORMATIONS (Historique)
-- ============================================================
CREATE TABLE autres_formations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    etudiant_id UUID NOT NULL REFERENCES etudiants(id) ON DELETE CASCADE,
    nom_formation VARCHAR(255) NOT NULL,
    institution VARCHAR(255),
    date_obtention DATE,
    diplome VARCHAR(255),
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_autres_form_etudiant ON autres_formations(etudiant_id);

-- ============================================================
-- DONNÉES INITIALES
-- ============================================================

-- Données administrateur
INSERT INTO utilisateurs (email, mot_de_passe, nom, prenom, role, statut, actif) VALUES
('admin@universite.sn', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36P4/KFm', 'Admin', 'Système', 'ADMIN', 'ACTIF', TRUE),
('prof@universite.sn', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36P4/KFm', 'Diallo', 'Mamadou', 'ENSEIGNANT', 'ACTIF', TRUE),
('etudiant@universite.sn', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36P4/KFm', 'Ba', 'Fatou', 'ETUDIANT', 'ACTIF', TRUE),
('admin2@universite.sn', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36P4/KFm', 'Ndiaye', 'Ousmane', 'ADMINISTRATIF', 'ACTIF', TRUE);

-- Données formations
INSERT INTO formations (code, nom, type_formation, niveau, date_debut, date_fin, duree_heures, budget_total) VALUES
('LIC-INFO-2024', 'Licence Informatique 2024', 'DIPLÔMANTE', 'LICENCE', '2024-09-01', '2027-06-30', 3000, 50000000),
('MASTER-IA-2024', 'Master Ingénierie des Applications', 'DIPLÔMANTE', 'MASTER', '2024-09-15', '2026-08-31', 2000, 75000000),
('CERT-WEB-2024', 'Certification Développement Web', 'CERTIFICATION', 'CERTIFICAT', '2024-10-01', '2025-03-31', 400, 5000000),
('DEV-MOBILE-2024', 'Formation Développement Mobile', 'COURTE', 'CERTIFICAT', '2024-11-01', '2025-02-28', 200, 3000000);

-- Étudiants
INSERT INTO etudiants (ine, utilisateur_id, date_naissance, formation_actuelle_id, promo, annee_debut, statut) 
VALUES ('INE000001', (SELECT id FROM utilisateurs WHERE email = 'etudiant@universite.sn'), '2003-05-15', 
        (SELECT id FROM formations WHERE code = 'LIC-INFO-2024'), 2024, 2024, 'ACTIF');

-- Enseignants
INSERT INTO enseignants (utilisateur_id, numero_agent, specialite, grade, statut)
VALUES ((SELECT id FROM utilisateurs WHERE email = 'prof@universite.sn'), 'AG001', 'Informatique', 'Maître Assistant', 'PERMANENT');

-- Cours
INSERT INTO cours (code, nom, description, formation_id, enseignant_id, credits, duree_heures, type_cours)
SELECT 'INFO101', 'Programmation I', 'Fondamentaux de la programmation', id, (SELECT id FROM enseignants LIMIT 1), 3, 60, 'MIXTE'
FROM formations WHERE code = 'LIC-INFO-2024';

INSERT INTO cours (code, nom, description, formation_id, enseignant_id, credits, duree_heures, type_cours)
SELECT 'INFO102', 'Algorithmique', 'Algorithmes et structures de données', id, (SELECT id FROM enseignants LIMIT 1), 3, 60, 'MIXTE'
FROM formations WHERE code = 'LIC-INFO-2024';

-- ============================================================
-- FIN DU SCHÉMA
-- ============================================================
