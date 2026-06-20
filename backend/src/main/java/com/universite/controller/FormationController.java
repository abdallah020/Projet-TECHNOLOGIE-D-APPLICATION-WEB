package com.universite.controller;

import com.universite.dto.FormationRequest;
import com.universite.entity.Formation;
import com.universite.service.FormationService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/formations")
public class FormationController {

    private final FormationService formationService;

    public FormationController(FormationService formationService) {
        this.formationService = formationService;
    }

    @PostMapping
    public Formation create(@RequestBody FormationRequest request) {
        return formationService.create(request);
    }

    @GetMapping
    public List<Formation> getAll() {
        return formationService.getAll();
    }

    @GetMapping("/{id}")
    public Formation getById(@PathVariable String id) {
        return formationService.getById(id);
    }

    @PutMapping("/{id}")
    public Formation update(@PathVariable String id, @RequestBody FormationRequest request) {
        return formationService.update(id, request);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable String id) {
        formationService.delete(id);
    }
}