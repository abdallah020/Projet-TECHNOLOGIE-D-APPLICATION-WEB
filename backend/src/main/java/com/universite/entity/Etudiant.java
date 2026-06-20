package com.universite.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "etudiants")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Etudiant {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String nom;

    @Column(nullable = false)
    private String prenom;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(name = "date_naissance")
    private LocalDate dateNaissance;

    @Column(nullable = false, unique = true)
    private String ine;

    private String formation;

    private String promo;

    @Column(name = "annee_debut")
    private Integer anneeDebut;

    @Column(name = "annee_sortie")
    private Integer anneeSortie;
}