package com.universite.repository;

import com.universite.entity.Inscription;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface InscriptionRepository extends JpaRepository<Inscription, UUID> {
}