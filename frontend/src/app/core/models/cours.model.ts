export type TypeCours = 'COURS' | 'TD' | 'TP' | 'MIXTE';

export interface Cours {
  id: string;
  code: string;
  nom: string;
  description: string;
  credits: number;
  dureeHeures: number;
  typeCours: TypeCours;
  formation: {
    id: string;
    nom: string;
  };
  enseignant?: {
    id: string;
    nom: string;
    prenom: string;
  };
}

export interface CoursCreate {
  code: string;
  nom: string;
  description: string;
  credits: number;
  dureeHeures: number;
  typeCours: TypeCours;
  formationId: string;
  enseignantId?: string;
}

export interface CoursUpdate extends CoursCreate {
  id: string;
}
