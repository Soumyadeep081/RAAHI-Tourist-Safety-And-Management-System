package com.raahi.controller;

import com.raahi.dto.DashboardStatsDTO;
import com.raahi.entity.User;
import com.raahi.repository.AlertRepository;
import com.raahi.repository.EmergencyContactRepository;
import com.raahi.repository.IncidentRepository;
import com.raahi.repository.LocationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/stats")
@RequiredArgsConstructor
public class StatsController {

    private final AlertRepository alertRepository;
    private final EmergencyContactRepository contactRepository;
    private final IncidentRepository incidentRepository;
    private final LocationRepository locationRepository;

    @GetMapping("/dashboard")
    public ResponseEntity<DashboardStatsDTO> getDashboardStats(@AuthenticationPrincipal User user) {
        long userId = user.getId();
        
        DashboardStatsDTO stats = DashboardStatsDTO.builder()
                .activeAlerts(alertRepository.countByUserIdAndStatus(userId, com.raahi.entity.Alert.AlertStatus.ACTIVE))
                .contactsCount(contactRepository.countByUserId(userId))
                .locationsCount(locationRepository.countByUserId(userId))
                .myIncidentsCount(incidentRepository.countByUserId(userId))
                .nearbyIncidents(incidentRepository.count()) // Simplified for now
                .build();
                
        return ResponseEntity.ok(stats);
    }
}
