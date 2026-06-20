package com.universite.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
public class CommunicationResponse {

    private UUID id;
    private String titre;
    private String contenu;
    private String typeCommunication;
    private String statut;

    private UUID auteurId;
    private String auteurNom;

    private LocalDateTime dateCreation;
}