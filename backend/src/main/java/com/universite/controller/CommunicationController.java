package com.universite.controller;

import com.universite.dto.CommunicationRequest;
import com.universite.dto.CommunicationResponse;
import com.universite.security.JwtService;
import com.universite.service.CommunicationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/communications")
@RequiredArgsConstructor
public class CommunicationController {

    private final CommunicationService communicationService;
    private final JwtService jwtService;

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN','ENSEIGNANT')")
    public CommunicationResponse create(
            @RequestBody CommunicationRequest request,
            @RequestHeader("Authorization") String token
    ) {
        String email = jwtService.extractUsername(token.substring(7));
        return communicationService.create(request, email);
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','ENSEIGNANT','ETUDIANT')")
    public List<CommunicationResponse> getAll() {
        return communicationService.getAll();
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public void delete(@PathVariable UUID id) {
        communicationService.delete(id);
    }
}