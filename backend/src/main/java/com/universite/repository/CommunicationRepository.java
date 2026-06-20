package com.universite.repository;

import com.universite.entity.Communication;
import com.universite.entity.StatutCommunication;
import com.universite.entity.TypeCommunication;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface CommunicationRepository extends JpaRepository<Communication, UUID> {

    List<Communication> findByTypeCommunication(TypeCommunication typeCommunication);

    List<Communication> findByStatut(StatutCommunication statut);
}