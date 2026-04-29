package com.raahi.dto;

import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class AuthResponse {
    private Long id;
    private String name;
    private String email;
    private String token;
}
