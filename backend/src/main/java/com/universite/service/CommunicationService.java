package com.universite.service;

import com.universite.dto.CommunicationRequest;
import com.universite.dto.CommunicationResponse;
import com.universite.entity.*;
import com.universite.repository.CommunicationRepository;
import com.universite.repository.UtilisateurRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CommunicationService {

    private final CommunicationRepository communicationRepository;
    private final UtilisateurRepository utilisateurRepository;

    public CommunicationResponse create(CommunicationRequest request, String email) {

        Utilisateur auteur = utilisateurRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Auteur introuvable"));

        Communication communication = Communication.builder()
                .titre(request.getTitre())
                .contenu(request.getContenu())
                .typeCommunication(request.getTypeCommunication())
                .auteur(auteur)
                .statut(StatutCommunication.BROUILLON) // 🔥 AJOUT IMPORTANT
                .build();

        Communication saved = communicationRepository.save(communication);

        return mapToResponse(saved);
    }

    public List<CommunicationResponse> getAll() {
        return communicationRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public void delete(UUID id) {
        communicationRepository.deleteById(id);
    }

    private CommunicationResponse mapToResponse(Communication c) {
        return CommunicationResponse.builder()
                .id(c.getId())
                .titre(c.getTitre())
                .contenu(c.getContenu())
                .typeCommunication(
                        c.getTypeCommunication() != null ? c.getTypeCommunication().name() : null
                )
                .statut(
                        c.getStatut() != null ? c.getStatut().name() : "BROUILLON"
                )
                .auteurId(c.getAuteur().getId())
                .auteurNom(c.getAuteur().getNom())
                .dateCreation(c.getDateCreation())
                .build();
    }
}