package com.universite.service;

import com.universite.dto.LoginResponse;
import com.universite.dto.RegisterRequest;
import com.universite.entity.Utilisateur;
import com.universite.entity.Role;
import com.universite.repository.UtilisateurRepository;
import com.universite.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UtilisateurRepository repository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    // 🔥 REGISTER
    public Utilisateur register(RegisterRequest request) {

        Utilisateur user = new Utilisateur();
        user.setEmail(request.getEmail());
        user.setMotDePasse(passwordEncoder.encode(request.getMotDePasse()));
        user.setNom(request.getNom());
        user.setPrenom(request.getPrenom());
        user.setRole(Role.ENSEIGNANT);
        user.setStatut("ACTIF");

        return repository.save(user);
    }

    // 🔥 LOGIN
    public LoginResponse login(String email, String password) {

        Utilisateur user = repository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(password, user.getMotDePasse())) {
            throw new RuntimeException("Mot de passe incorrect");
        }

        String token = jwtService.generateToken(user.getEmail());

        return LoginResponse.builder()
                .token(token)
                .role(user.getRole().name())
                .email(user.getEmail())
                .nom(user.getNom())
                .prenom(user.getPrenom())
                .id(user.getId())
                .build();
    }
}