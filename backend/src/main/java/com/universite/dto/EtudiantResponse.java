package com.universite.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.util.UUID;

@Data
@Builder
public class EtudiantResponse {

    private UUID id;
    private String nom;
    private String prenom;
    private String email;
    private String ine;
    private LocalDate dateNaissance;
    private String formation;
    private String promo;
    private Integer anneeDebut;
    private Integer anneeSortie;
}