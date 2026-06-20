package com.universite.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "enseignants")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Enseignant {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(unique = true)
    private String numeroAgent;

    private String nom;
    private String prenom;

    private String specialite;
    private String grade;
    private String diplomeSupreme;

    private LocalDate dateEmbauche;

    private String bureauNumero;
    private String cvUrl;

    private String statut;
}