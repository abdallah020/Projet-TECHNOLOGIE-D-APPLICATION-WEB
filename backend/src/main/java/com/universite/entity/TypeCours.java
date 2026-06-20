package com.universite.entity;

import com.fasterxml.jackson.annotation.JsonCreator;

public enum TypeCours {
    COURS,
    TD,
    TP,
    MIXTE;

    @JsonCreator
    public static TypeCours from(String value) {
        return TypeCours.valueOf(value.toUpperCase());
    }
}