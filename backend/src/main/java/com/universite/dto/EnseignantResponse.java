package com.universite.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.util.UUID;

@Data
@Builder
public class EnseignantResponse {

    private UUID id;

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