export type StatutInscription = 'INSCRIT' | 'VALIDÉ' | 'REJETÉ' | 'EN_ATTENTE';

export interface Inscription {
  id: string;
  etudiantNom: string;
  etudiantPrenom: string;
  etudiantId?: string;
  formationNom: string;
  formationCode: string;
  formationId?: string;
  statut: StatutInscription;
  dateInscription: string;
}

export interface InscriptionCreate {
  etudiantId: string;
  formationId: string;
}
