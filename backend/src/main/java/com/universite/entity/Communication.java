package com.universite.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "communications")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Communication {

    @Id
    @GeneratedValue
    private UUID id;

    private String titre;

    @Column(columnDefinition = "TEXT")
    private String contenu;

    @Enumerated(EnumType.STRING)
    @Column(name = "type_communication", nullable = false)
    private TypeCommunication typeCommunication;

    @Enumerated(EnumType.STRING)
    private StatutCommunication statut;

    @ManyToOne
    @JoinColumn(name = "auteur_id", nullable = false)
    private Utilisateur auteur;

    private LocalDateTime dateCreation;

    @PrePersist
    public void prePersist() {
        if (this.dateCreation == null) {
            this.dateCreation = LocalDateTime.now();
        }

        if (this.statut == null) {
            this.statut = StatutCommunication.BROUILLON;
        }
    }
}