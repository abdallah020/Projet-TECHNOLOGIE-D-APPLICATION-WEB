package com.universite.dto;

import lombok.Data;

import java.util.UUID;

@Data
public class InscriptionRequest {

    private UUID etudiantId;
    private UUID formationId;
    private String statut;
}