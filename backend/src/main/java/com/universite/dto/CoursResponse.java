package com.universite.dto;

import lombok.Builder;
import lombok.Data;

import java.util.UUID;

@Data
@Builder
public class CoursResponse {

    private UUID id;
    private String code;
    private String nom;
    private String description;
    private Integer credits;
    private Integer dureeHeures;
    private String typeCours;

    private String enseignantNom;
    private String formationNom;
}