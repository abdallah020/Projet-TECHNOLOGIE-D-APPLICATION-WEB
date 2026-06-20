export type TypeCommunication = 'REUNION' | 'INFO' | 'ANNONCE';
export type StatutCommunication = 'BROUILLON' | 'PUBLIÉ' | 'ARCHIVÉ';

export interface Communication {
  id: string;
  titre: string;
  contenu: string;
  typeCommunication: TypeCommunication;
  statut: StatutCommunication;
  auteurNom: string;
  auteurId?: string;
  dateCreation: string;
  datePublication?: string;
}

export interface CommunicationCreate {
  titre: string;
  contenu: string;
  typeCommunication: TypeCommunication;
  statut: StatutCommunication;
}

export interface CommunicationUpdate extends CommunicationCreate {
  id: string;
}
