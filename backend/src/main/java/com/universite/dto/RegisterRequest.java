package com.universite.dto;

import lombok.Data;

@Data
public class RegisterRequest {
    private String email;
    private String motDePasse;
    private String nom;
    private String prenom;
}