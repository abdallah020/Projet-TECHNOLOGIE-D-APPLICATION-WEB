export interface User {
  id: string;
  email: string;
  nom: string;
  prenom: string;
  role: 'ADMIN' | 'ENSEIGNANT' | 'ETUDIANT';
  token?: string;
}

export interface LoginRequest {
  email: string;
  motDePasse: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  nom: string;
  prenom: string;
  role?: string;
}

export interface AuthResponse {
  token: string;
  role: 'ADMIN' | 'ENSEIGNANT' | 'ETUDIANT';
  nom: string;
  prenom: string;
  email: string;
  id: string;
}
