package com.universite.service;

import com.universite.dto.InscriptionRequest;
import com.universite.dto.InscriptionResponse;
import com.universite.entity.Etudiant;
import com.universite.entity.Formation;
import com.universite.entity.Inscription;
import com.universite.repository.EtudiantRepository;
import com.universite.repository.FormationRepository;
import com.universite.repository.InscriptionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class InscriptionService {

    private final InscriptionRepository inscriptionRepository;
    private final EtudiantRepository etudiantRepository;
    private final FormationRepository formationRepository;

    public InscriptionResponse inscrire(InscriptionRequest request) {

        Etudiant etudiant = etudiantRepository.findById(request.getEtudiantId())
                .orElseThrow(() -> new RuntimeException("Etudiant introuvable"));

        Formation formation = formationRepository.findById(request.getFormationId())
                .orElseThrow(() -> new RuntimeException("Formation introuvable"));

        Inscription inscription = Inscription.builder()
                .etudiant(etudiant)
                .formation(formation)
                .dateInscription(LocalDateTime.now())
                .statut(request.getStatut() != null ? request.getStatut() : "INSCRIT")
                .build();

        return map(inscriptionRepository.save(inscription));
    }

    public List<InscriptionResponse> getAll() {
        return inscriptionRepository.findAll()
                .stream()
                .map(this::map)
                .toList();
    }

    private InscriptionResponse map(Inscription i) {
        return InscriptionResponse.builder()
                .id(i.getId())
                .etudiantNom(i.getEtudiant().getNom())
                .etudiantPrenom(i.getEtudiant().getPrenom())
                .formationNom(i.getFormation().getNom())
                .formationCode(i.getFormation().getCode())
                .statut(i.getStatut())
                .build();
    }
}