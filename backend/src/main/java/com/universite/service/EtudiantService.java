package com.universite.service;

import com.universite.dto.EtudiantRequest;
import com.universite.dto.EtudiantResponse;
import com.universite.entity.Etudiant;
import com.universite.repository.EtudiantRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class EtudiantService {

    private final EtudiantRepository etudiantRepository;

    public EtudiantResponse create(EtudiantRequest request) {

        Etudiant etudiant = Etudiant.builder()
                .ine(request.getIne())
                .nom(request.getNom())
                .prenom(request.getPrenom())
                .email(request.getEmail())
                .dateNaissance(request.getDateNaissance())
                .formation(request.getFormation())
                .promo(request.getPromo())
                .anneeDebut(request.getAnneeDebut())
                .anneeSortie(request.getAnneeSortie())
                .build();

        return map(etudiantRepository.save(etudiant));
    }

    public List<EtudiantResponse> getAll() {
        return etudiantRepository.findAll()
                .stream()
                .map(this::map)
                .toList();
    }

    public EtudiantResponse getById(String id) {

        Etudiant e = etudiantRepository.findById(UUID.fromString(id))
                .orElseThrow(() -> new RuntimeException("Étudiant introuvable"));

        return map(e);
    }

    public EtudiantResponse update(String id, EtudiantRequest request) {

        Etudiant e = etudiantRepository.findById(UUID.fromString(id))
                .orElseThrow(() -> new RuntimeException("Étudiant introuvable"));

        e.setIne(request.getIne());
        e.setNom(request.getNom());
        e.setPrenom(request.getPrenom());
        e.setEmail(request.getEmail());
        e.setDateNaissance(request.getDateNaissance());
        e.setFormation(request.getFormation());
        e.setPromo(request.getPromo());
        e.setAnneeDebut(request.getAnneeDebut());
        e.setAnneeSortie(request.getAnneeSortie());

        return map(etudiantRepository.save(e));
    }

    public void delete(String id) {
        etudiantRepository.deleteById(UUID.fromString(id));
    }

    private EtudiantResponse map(Etudiant e) {

        return EtudiantResponse.builder()
                .id(e.getId())
                .ine(e.getIne())
                .nom(e.getNom())
                .prenom(e.getPrenom())
                .email(e.getEmail())
                .dateNaissance(e.getDateNaissance())
                .formation(e.getFormation())
                .promo(e.getPromo())
                .anneeDebut(e.getAnneeDebut())
                .anneeSortie(e.getAnneeSortie())
                .build();
    }
}