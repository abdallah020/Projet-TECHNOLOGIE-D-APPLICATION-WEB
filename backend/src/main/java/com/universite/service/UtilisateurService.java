package com.universite.service;

import com.universite.entity.Utilisateur;
import com.universite.repository.UtilisateurRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UtilisateurService {

    private final UtilisateurRepository utilisateurRepository;

    public List<Utilisateur> getAll() {
        return utilisateurRepository.findAll();
    }

    public Utilisateur getById(UUID id) {
        return utilisateurRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));
    }
}