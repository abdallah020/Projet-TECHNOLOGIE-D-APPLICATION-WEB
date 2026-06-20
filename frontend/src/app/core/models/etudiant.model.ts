export interface Etudiant {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  ine: string;
  dateNaissance: string;
  formation: string;
  promo: string;
  anneeDebut: number;
  anneeSortie: number;
}

export interface EtudiantCreate {
  nom: string;
  prenom: string;
  email: string;
  ine: string;
  dateNaissance: string;
  formation: string;
  promo: string;
  anneeDebut: number;
  anneeSortie: number;
}

export interface EtudiantUpdate extends EtudiantCreate {
  id: string;
}
