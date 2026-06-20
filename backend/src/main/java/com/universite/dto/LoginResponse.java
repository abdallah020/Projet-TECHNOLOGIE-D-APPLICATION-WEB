package com.universite.dto;

import lombok.*;

import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class LoginResponse {

    private String token;
    private String role;
    private String nom;
    private String prenom;
    private String email;
    private UUID id;
}