package com.universite.repository;

import com.universite.entity.Etudiant;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface EtudiantRepository extends JpaRepository<Etudiant, UUID> {
}