package com.raahi.dto;

import jakarta.validation.constraints.NotNull;
import lombok.*;
import java.time.LocalDateTime;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class AlertDTO {
    private Long id;
    private Long userId;
    private String type;
    private String status;

    @NotNull(message = "Latitude is required")
    private Double latitude;

    @NotNull(message = "Longitude is required")
    private Double longitude;

    private String message;
    private Double distanceKm;
    private LocalDateTime createdAt;
    private LocalDateTime resolvedAt;
}
