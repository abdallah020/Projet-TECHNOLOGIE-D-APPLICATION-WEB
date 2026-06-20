package com.universite.controller;

import com.universite.dto.CoursRequest;
import com.universite.entity.Cours;
import com.universite.service.CoursService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/cours")
public class CoursController {

    private final CoursService coursService;

    public CoursController(CoursService coursService) {
        this.coursService = coursService;
    }

    @PostMapping
    public Cours create(@RequestBody CoursRequest request) {
        return coursService.create(request);
    }

    @GetMapping
    public List<Cours> getAll() {
        return coursService.getAll();
    }

    @PutMapping("/{id}")
    public Cours update(@PathVariable String id, @RequestBody CoursRequest request) {
        return coursService.update(id, request);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable String id) {
        coursService.delete(id);
    }
}