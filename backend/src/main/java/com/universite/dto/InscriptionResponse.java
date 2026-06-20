package com.universite.dto;

import lombok.Builder;
import lombok.Data;

import java.util.UUID;

@Data
@Builder
public class InscriptionResponse {

    private UUID id;

    private String etudiantNom;
    private String etudiantPrenom;

    private String formationNom;
    private String formationCode;

    private String statut;
}