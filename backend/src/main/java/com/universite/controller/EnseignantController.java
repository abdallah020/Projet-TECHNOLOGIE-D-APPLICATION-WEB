package com.universite.controller;

import com.universite.dto.EnseignantRequest;
import com.universite.dto.EnseignantResponse;
import com.universite.service.EnseignantService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/enseignants")
@RequiredArgsConstructor
public class EnseignantController {

    private final EnseignantService enseignantService;

    @PostMapping
    public EnseignantResponse create(@RequestBody EnseignantRequest request) {
        return enseignantService.create(request);
    }

    @GetMapping
    public List<EnseignantResponse> getAll() {
        return enseignantService.getAll();
    }

    @GetMapping("/{id}")
    public EnseignantResponse getById(@PathVariable String id) {
        return enseignantService.getById(id);
    }

    @PutMapping("/{id}")
    public EnseignantResponse update(@PathVariable String id,
                                     @RequestBody EnseignantRequest request) {
        return enseignantService.update(id, request);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable String id) {
        enseignantService.delete(id);
    }
}