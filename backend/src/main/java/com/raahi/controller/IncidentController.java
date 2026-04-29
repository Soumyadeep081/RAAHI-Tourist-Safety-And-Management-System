package com.raahi.controller;

import com.raahi.dto.IncidentDTO;
import com.raahi.entity.User;
import com.raahi.service.IncidentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/incidents")
@RequiredArgsConstructor
public class IncidentController {

    private final IncidentService incidentService;

    @PostMapping
    public ResponseEntity<IncidentDTO> report(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody IncidentDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(incidentService.reportIncident(user, dto));
    }

    @GetMapping("/nearby")
    public ResponseEntity<List<IncidentDTO>> getNearby(
            @RequestParam double lat,
            @RequestParam double lng,
            @RequestParam(defaultValue = "5") double radius) {
        return ResponseEntity.ok(incidentService.getNearbyIncidents(lat, lng, radius));
    }

    @GetMapping("/my")
    public ResponseEntity<List<IncidentDTO>> getMyIncidents(
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(incidentService.getMyIncidents(user.getId()));
    }
}
