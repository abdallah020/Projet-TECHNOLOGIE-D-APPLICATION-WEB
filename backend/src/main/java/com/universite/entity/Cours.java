package com.universite.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

@Entity
@Table(name = "cours")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Cours {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, unique = true)
    private String code;

    private String nom;
    private String description;

    private Integer credits;
    private Integer dureeHeures;

    // 🔥 FIX IMPORTANT
    @Enumerated(EnumType.STRING)
    private TypeCours typeCours;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "enseignant_id")
    private Enseignant enseignant;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "formation_id")
    private Formation formation;
}