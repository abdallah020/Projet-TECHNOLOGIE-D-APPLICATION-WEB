package com.universite.dto;

import lombok.Data;

import java.time.LocalDate;

@Data
public class EnseignantRequest {

    private String numeroAgent;

    private String nom;
    private String prenom;

    private String specialite;
    private String grade;
    private String diplomeSupreme;
    private LocalDate dateEmbauche;
    private String bureauNumero;
    private String cvUrl;
    private String statut;
}