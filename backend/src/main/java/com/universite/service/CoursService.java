package com.universite.service;

import com.universite.dto.CoursRequest;
import com.universite.entity.*;
import com.universite.repository.*;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class CoursService {

    private final CoursRepository coursRepository;
    private final EnseignantRepository enseignantRepository;
    private final FormationRepository formationRepository;

    public CoursService(
            CoursRepository coursRepository,
            EnseignantRepository enseignantRepository,
            FormationRepository formationRepository
    ) {
        this.coursRepository = coursRepository;
        this.enseignantRepository = enseignantRepository;
        this.formationRepository = formationRepository;
    }

    public Cours create(CoursRequest request) {

        Enseignant enseignant = findEnseignant(request.getEnseignantId());
        Formation formation = findFormation(request.getFormationId());

        Cours cours = Cours.builder()
                .code(request.getCode())
                .nom(request.getNom())
                .description(request.getDescription())
                .credits(request.getCredits())
                .dureeHeures(request.getDureeHeures())
                .typeCours(request.getTypeCours() != null ? request.getTypeCours() : TypeCours.MIXTE)
                .enseignant(enseignant)
                .formation(formation)
                .build();

        return coursRepository.save(cours);
    }

    public List<Cours> getAll() {
        return coursRepository.findAll();
    }

    public Cours update(String id, CoursRequest request) {

        UUID uuid = parseUUID(id);

        Cours cours = coursRepository.findById(uuid)
                .orElseThrow(() -> new RuntimeException("Cours introuvable"));

        Enseignant enseignant = findEnseignant(request.getEnseignantId());
        Formation formation = findFormation(request.getFormationId());

        if (request.getCode() != null) cours.setCode(request.getCode());
        if (request.getNom() != null) cours.setNom(request.getNom());
        if (request.getDescription() != null) cours.setDescription(request.getDescription());
        if (request.getCredits() != null) cours.setCredits(request.getCredits());
        if (request.getDureeHeures() != null) cours.setDureeHeures(request.getDureeHeures());

        if (request.getTypeCours() != null) {
            cours.setTypeCours(request.getTypeCours());
        }

        if (enseignant != null) cours.setEnseignant(enseignant);
        if (formation != null) cours.setFormation(formation);

        return coursRepository.save(cours);
    }

    public void delete(String id) {
        coursRepository.deleteById(parseUUID(id));
    }

    // ================= HELPERS =================

    private Enseignant findEnseignant(UUID id) {
        if (id == null) return null;
        return enseignantRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Enseignant introuvable"));
    }

    private Formation findFormation(UUID id) {
        if (id == null) return null;
        return formationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Formation introuvable"));
    }

    private UUID parseUUID(String id) {
        try {
            return UUID.fromString(id);
        } catch (Exception e) {
            throw new RuntimeException("ID invalide");
        }
    }
}