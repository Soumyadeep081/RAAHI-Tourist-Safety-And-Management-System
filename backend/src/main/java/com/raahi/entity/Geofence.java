package com.raahi.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "geofences")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Geofence {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(nullable = false)
    private double latitude;

    @Column(nullable = false)
    private double longitude;

    @Column(nullable = false)
    private double radius; // radius in meters

    @Column(name = "zone_type", nullable = false, length = 20)
    private String zoneType; // RED, YELLOW, GREEN

    @Column(length = 255)
    private String description;
}
