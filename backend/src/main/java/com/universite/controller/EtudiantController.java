package com.universite.controller;

import com.universite.dto.EtudiantRequest;
import com.universite.dto.EtudiantResponse;
import com.universite.service.EtudiantService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/etudiants")
@RequiredArgsConstructor
public class EtudiantController {

    private final EtudiantService etudiantService;

    @PostMapping
    public ResponseEntity<EtudiantResponse> create(@RequestBody EtudiantRequest request) {
        return ResponseEntity.ok(etudiantService.create(request));
    }

    @GetMapping
    public ResponseEntity<List<EtudiantResponse>> getAll() {
        return ResponseEntity.ok(etudiantService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<EtudiantResponse> getById(@PathVariable String id) {
        return ResponseEntity.ok(etudiantService.getById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<EtudiantResponse> update(
            @PathVariable String id,
            @RequestBody EtudiantRequest request) {
        return ResponseEntity.ok(etudiantService.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        etudiantService.delete(id);
        return ResponseEntity.noContent().build();
    }
}