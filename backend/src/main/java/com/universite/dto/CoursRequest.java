package com.universite.dto;

import com.universite.entity.TypeCours;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.util.UUID;

@Data
public class CoursRequest {

    @NotBlank(message = "Le code est obligatoire")
    private String code;

    @NotBlank(message = "Le nom est obligatoire")
    private String nom;

    private String description;

    private Integer credits;

    private Integer dureeHeures;

    // 🔥 FIX IMPORTANT
    private TypeCours typeCours;

    private UUID enseignantId;

    private UUID formationId;
}