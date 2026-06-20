package com.universite.repository;

import com.universite.entity.Formation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface FormationRepository extends JpaRepository<Formation, UUID> {
}