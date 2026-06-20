package com.universite.dto;

import com.universite.entity.TypeCommunication;
import lombok.Data;

@Data
public class CommunicationRequest {

    private String titre;
    private String contenu;
    private TypeCommunication typeCommunication;
}