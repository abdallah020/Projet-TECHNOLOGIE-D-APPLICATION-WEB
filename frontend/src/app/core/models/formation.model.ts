export type NiveauFormation = 'LICENCE' | 'MASTER' | 'DOCTORAT';

export type TypeFormation = 'DIPLÔMANTE' | 'CERTIFIANTE' | 'QUALIFIANTE';

export type StatutFormation =
  | 'PLANIFIEE'
  | 'EN_COURS'
  | 'TERMINEE'
  | 'ANNULEE';

export interface Formation {
  id: string;
  code: string;
  nom: string;

  description?: string; // ✅ AJOUT ICI

  niveau: NiveauFormation;
  typeFormation: TypeFormation;

  dateDebut: string;
  dateFin: string;

  budgetTotal: number;
  statut: StatutFormation;

  nombreEtudiants?: number;
}

export interface FormationCreate {
  code: string;
  nom: string;
  niveau: NiveauFormation;
  typeFormation: TypeFormation;
  dateDebut: string;
  dateFin: string;
  budgetTotal: number;
  statut: StatutFormation;
}

export interface FormationUpdate extends FormationCreate {
  id: string;
}
