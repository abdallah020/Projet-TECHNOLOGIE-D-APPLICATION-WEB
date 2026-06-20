package com.universite.repository;

import com.universite.entity.Enseignant;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface EnseignantRepository extends JpaRepository<Enseignant, UUID> {
}