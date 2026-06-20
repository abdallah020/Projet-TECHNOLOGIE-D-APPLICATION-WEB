package com.universite.repository;

import com.universite.entity.Cours;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface CoursRepository extends JpaRepository<Cours, UUID> {
    boolean existsByCode(String code);
}