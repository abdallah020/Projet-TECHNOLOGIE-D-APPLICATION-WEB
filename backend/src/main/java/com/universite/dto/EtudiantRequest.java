package com.universite.dto;

import lombok.Data;

import java.time.LocalDate;

@Data
public class EtudiantRequest {
    private String nom;
    private String prenom;
    private String email;
    private LocalDate dateNaissance;
    private String formation;
    private String promo;
    private int anneeDebut;
    private int anneeSortie;
    private String ine;
}