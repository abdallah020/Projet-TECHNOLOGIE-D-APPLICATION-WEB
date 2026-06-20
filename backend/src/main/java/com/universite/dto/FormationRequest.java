package com.universite.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

import com.universite.entity.StatutFormation;
import lombok.Data;

@Data
public class FormationRequest {

    private String code;
    private String nom;
    private String description;
    private String niveau;

    private LocalDate dateDebut;
    private LocalDate dateFin;

    private Integer dureeHeures;

    private Integer nombreEtudiants;
    private Integer nombreHommes;
    private Integer nombreFemmes;

    private BigDecimal budgetTotal;

    private String typeFormation;
    private String typeFinancement;

    // 🔥 AJOUT IMPORTANT
    private StatutFormation statut;
}