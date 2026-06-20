package com.universite.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "formations")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Formation {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, unique = true)
    private String code;

    @Column(nullable = false)
    private String nom;

    @Column(columnDefinition = "TEXT")
    private String description;

    private String typeFormation; // DIPLÔMANTE, CERTIFICATION...

    private String niveau; // LICENCE, MASTER...

    private LocalDate dateDebut;

    private LocalDate dateFin;

    private Integer dureeHeures;

    private Integer nombreEtudiants;

    private Integer nombreHommes;

    private Integer nombreFemmes;

    private BigDecimal budgetTotal;

    private String typeFinancement;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatutFormation statut;
}