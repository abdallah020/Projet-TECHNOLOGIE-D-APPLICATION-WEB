package com.universite.service;

import com.universite.dto.FormationRequest;
import com.universite.entity.Formation;
import com.universite.entity.StatutFormation;
import com.universite.repository.FormationRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class FormationService {

    private final FormationRepository formationRepository;

    public FormationService(FormationRepository formationRepository) {
        this.formationRepository = formationRepository;
    }

    public Formation create(FormationRequest request) {

        Formation formation = Formation.builder()
                .code(request.getCode())
                .nom(request.getNom())
                .description(request.getDescription())
                .niveau(request.getNiveau())
                .dateDebut(request.getDateDebut())
                .dateFin(request.getDateFin())
                .dureeHeures(request.getDureeHeures())
                .nombreEtudiants(request.getNombreEtudiants())
                .nombreHommes(request.getNombreHommes())
                .nombreFemmes(request.getNombreFemmes())
                .budgetTotal(request.getBudgetTotal())
                .typeFormation(request.getTypeFormation())
                .typeFinancement(request.getTypeFinancement())
                .statut(request.getStatut() != null ? request.getStatut() : StatutFormation.PLANIFIEE)
                .build();

        return formationRepository.save(formation);
    }

    public List<Formation> getAll() {
        return formationRepository.findAll();
    }

    public Formation getById(String id) {
        return formationRepository.findById(UUID.fromString(id))
                .orElseThrow(() -> new RuntimeException("Formation introuvable"));
    }

    public Formation update(String id, FormationRequest request) {

        Formation formation = getById(id);

        formation.setCode(request.getCode());
        formation.setNom(request.getNom());
        formation.setDescription(request.getDescription());
        formation.setNiveau(request.getNiveau());
        formation.setDateDebut(request.getDateDebut());
        formation.setDateFin(request.getDateFin());
        formation.setDureeHeures(request.getDureeHeures());
        formation.setNombreEtudiants(request.getNombreEtudiants());
        formation.setNombreHommes(request.getNombreHommes());
        formation.setNombreFemmes(request.getNombreFemmes());
        formation.setBudgetTotal(request.getBudgetTotal());
        formation.setTypeFormation(request.getTypeFormation());
        formation.setTypeFinancement(request.getTypeFinancement());
        formation.setStatut(request.getStatut());

        return formationRepository.save(formation);
    }

    public void delete(String id) {
        formationRepository.deleteById(UUID.fromString(id));
    }
}