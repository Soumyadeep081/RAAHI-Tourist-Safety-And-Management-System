package com.raahi.service;

import com.raahi.dto.AlertDTO;
import com.raahi.entity.Alert;
import com.raahi.entity.User;
import com.raahi.repository.AlertRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AlertService {

    private final AlertRepository alertRepository;

    // ~1 degree latitude ≈ 111 km
    private static final double KM_PER_DEGREE = 111.0;

    public AlertDTO createSOS(User user, AlertDTO dto) {
        Alert alert = Alert.builder()
                .user(user)
                .type(Alert.AlertType.SOS)
                .status(Alert.AlertStatus.ACTIVE)
                .latitude(dto.getLatitude())
                .longitude(dto.getLongitude())
                .message(dto.getMessage())
                .build();

        alert = alertRepository.save(alert);
        return toDTO(alert);
    }

    public List<AlertDTO> getNearbyAlerts(double lat, double lng, double radiusKm) {
        double deltaLat = radiusKm / KM_PER_DEGREE;
        double deltaLng = radiusKm / (KM_PER_DEGREE * Math.cos(Math.toRadians(lat)));

        List<Alert> alerts = alertRepository.findNearbyActive(
                lat - deltaLat, lat + deltaLat,
                lng - deltaLng, lng + deltaLng);

        return alerts.stream().map(a -> {
            AlertDTO dto = toDTO(a);
            dto.setDistanceKm(haversine(lat, lng, a.getLatitude(), a.getLongitude()));
            return dto;
        }).collect(Collectors.toList());
    }

    public List<AlertDTO> getMyAlerts(Long userId) {
        return alertRepository.findByUserIdOrderByCreatedAtDesc(userId)
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    public AlertDTO resolveAlert(Long alertId, Long userId) {
        Alert alert = alertRepository.findById(alertId)
                .orElseThrow(() -> new RuntimeException("Alert not found"));

        if (!alert.getUser().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized to resolve this alert");
        }

        alert.setStatus(Alert.AlertStatus.RESOLVED);
        alert.setResolvedAt(LocalDateTime.now());
        alert = alertRepository.save(alert);
        return toDTO(alert);
    }

    private AlertDTO toDTO(Alert a) {
        return AlertDTO.builder()
                .id(a.getId())
                .userId(a.getUser().getId())
                .type(a.getType().name())
                .status(a.getStatus().name())
                .latitude(a.getLatitude())
                .longitude(a.getLongitude())
                .message(a.getMessage())
                .createdAt(a.getCreatedAt())
                .resolvedAt(a.getResolvedAt())
                .build();
    }

    /**
     * Haversine formula for distance between two GPS coordinates.
     */
    private double haversine(double lat1, double lon1, double lat2, double lon2) {
        double R = 6371; // Earth radius in km
        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lon2 - lon1);
        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                   Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2)) *
                   Math.sin(dLon / 2) * Math.sin(dLon / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return Math.round(R * c * 100.0) / 100.0;
    }
}
