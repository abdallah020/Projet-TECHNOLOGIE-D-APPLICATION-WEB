package com.universite.dto;

import com.universite.entity.StatutFormation;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

@Data
@Builder
public class FormationResponse {

    private UUID id;
    private String code;
    private String nom;
    private String description;
    private String typeFormation;
    private String niveau;
    private LocalDate dateDebut;
    private LocalDate dateFin;
    private Integer dureeHeures;

    private Integer nombreEtudiants;
    private Integer nombreHommes;
    private Integer nombreFemmes;

    private BigDecimal budgetTotal;
    private String typeFinancement;
    private StatutFormation statut;
}