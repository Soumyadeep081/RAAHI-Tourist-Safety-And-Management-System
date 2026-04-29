package com.raahi.service;

import com.raahi.dto.IncidentDTO;
import com.raahi.entity.Incident;
import com.raahi.entity.User;
import com.raahi.repository.IncidentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class IncidentService {

    private final IncidentRepository incidentRepository;
    private static final double KM_PER_DEGREE = 111.0;

    public IncidentDTO reportIncident(User user, IncidentDTO dto) {
        Incident incident = Incident.builder()
                .user(user)
                .type(Incident.IncidentType.valueOf(dto.getType()))
                .description(dto.getDescription())
                .latitude(dto.getLatitude())
                .longitude(dto.getLongitude())
                .status(Incident.IncidentStatus.REPORTED)
                .build();

        incident = incidentRepository.save(incident);
        return toDTO(incident);
    }

    public List<IncidentDTO> getNearbyIncidents(double lat, double lng, double radiusKm) {
        double deltaLat = radiusKm / KM_PER_DEGREE;
        double deltaLng = radiusKm / (KM_PER_DEGREE * Math.cos(Math.toRadians(lat)));

        return incidentRepository.findNearby(
                        lat - deltaLat, lat + deltaLat,
                        lng - deltaLng, lng + deltaLng)
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    public List<IncidentDTO> getMyIncidents(Long userId) {
        return incidentRepository.findByUserIdOrderByCreatedAtDesc(userId)
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    private IncidentDTO toDTO(Incident i) {
        return IncidentDTO.builder()
                .id(i.getId())
                .userId(i.getUser().getId())
                .type(i.getType().name())
                .description(i.getDescription())
                .latitude(i.getLatitude())
                .longitude(i.getLongitude())
                .status(i.getStatus().name())
                .createdAt(i.getCreatedAt())
                .build();
    }
}
