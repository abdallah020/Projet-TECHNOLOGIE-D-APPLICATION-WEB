export interface Enseignant {
  id: string;

  numeroAgent: string;

  nom: string;
  prenom: string;

  specialite: string;
  grade: string;

  diplomeSupreme?: string;
  dateEmbauche?: string;
  bureauNumero?: string;
  cvUrl?: string;

  statut: 'ACTIF' | 'INACTIF' | 'CONGE' | 'PERMANENT' | 'VACATAIRE';
}

export interface EnseignantCreate {
  numeroAgent: string;

  nom: string;
  prenom: string;

  specialite: string;
  grade: string;

  statut: 'ACTIF' | 'INACTIF' | 'CONGE' | 'PERMANENT' | 'VACATAIRE';

  diplomeSupreme?: string;
  dateEmbauche?: string;
  bureauNumero?: string;
  cvUrl?: string;
}

export interface EnseignantUpdate extends EnseignantCreate {
  id: string;
}