package com.universite.service;

import com.universite.dto.EnseignantRequest;
import com.universite.dto.EnseignantResponse;
import com.universite.entity.Enseignant;
import com.universite.repository.EnseignantRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class EnseignantService {

    private final EnseignantRepository enseignantRepository;

    public EnseignantResponse create(EnseignantRequest request) {

        Enseignant e = Enseignant.builder()
                .numeroAgent(request.getNumeroAgent())
                .nom(request.getNom())
                .prenom(request.getPrenom())
                .specialite(request.getSpecialite())
                .grade(request.getGrade())
                .diplomeSupreme(request.getDiplomeSupreme())
                .dateEmbauche(request.getDateEmbauche())
                .bureauNumero(request.getBureauNumero())
                .cvUrl(request.getCvUrl())
                .statut(request.getStatut())
                .build();

        return map(enseignantRepository.save(e));
    }

    public List<EnseignantResponse> getAll() {
        return enseignantRepository.findAll()
                .stream()
                .map(this::map)
                .toList();
    }

    public EnseignantResponse getById(String id) {
        Enseignant e = enseignantRepository.findById(UUID.fromString(id))
                .orElseThrow(() -> new RuntimeException("Enseignant introuvable"));

        return map(e);
    }

    public EnseignantResponse update(String id, EnseignantRequest request) {

        Enseignant e = enseignantRepository.findById(UUID.fromString(id))
                .orElseThrow(() -> new RuntimeException("Enseignant introuvable"));

        e.setNumeroAgent(request.getNumeroAgent());
        e.setNom(request.getNom());
        e.setPrenom(request.getPrenom());
        e.setSpecialite(request.getSpecialite());
        e.setGrade(request.getGrade());
        e.setDiplomeSupreme(request.getDiplomeSupreme());
        e.setDateEmbauche(request.getDateEmbauche());
        e.setBureauNumero(request.getBureauNumero());
        e.setCvUrl(request.getCvUrl());
        e.setStatut(request.getStatut());

        return map(enseignantRepository.save(e));
    }

    public void delete(String id) {
        enseignantRepository.deleteById(UUID.fromString(id));
    }

    private EnseignantResponse map(Enseignant e) {
        return EnseignantResponse.builder()
                .id(e.getId())
                .numeroAgent(e.getNumeroAgent())
                .nom(e.getNom())
                .prenom(e.getPrenom())
                .specialite(e.getSpecialite())
                .grade(e.getGrade())
                .diplomeSupreme(e.getDiplomeSupreme())
                .dateEmbauche(e.getDateEmbauche())
                .bureauNumero(e.getBureauNumero())
                .cvUrl(e.getCvUrl())
                .statut(e.getStatut())
                .build();
    }
}