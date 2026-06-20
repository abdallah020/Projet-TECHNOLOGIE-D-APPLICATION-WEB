package com.universite.controller;

import com.universite.dto.LoginRequest;
import com.universite.dto.LoginResponse;
import com.universite.dto.RegisterRequest;
import com.universite.security.JwtService;
import com.universite.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final JwtService jwtService;

    // 🔥 REGISTER
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authService.register(request));
    }

    // 🔥 LOGIN
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) {
        return ResponseEntity.ok(
                authService.login(request.getEmail(), request.getMotDePasse())
        );
    }
}