package com.universite.controller;

import com.universite.dto.InscriptionRequest;
import com.universite.dto.InscriptionResponse;
import com.universite.service.InscriptionService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/inscriptions")
@RequiredArgsConstructor
public class InscriptionController {

    private final InscriptionService inscriptionService;

    @PostMapping
    public InscriptionResponse inscrire(@RequestBody InscriptionRequest request) {
        return inscriptionService.inscrire(request);
    }

    @GetMapping
    public List<InscriptionResponse> getAll() {
        return inscriptionService.getAll();
    }
}