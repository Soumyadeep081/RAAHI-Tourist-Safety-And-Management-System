package com.raahi.controller;

import com.raahi.dto.AlertDTO;
import com.raahi.entity.User;
import com.raahi.service.AlertService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/alerts")
@RequiredArgsConstructor
public class AlertController {

    private final AlertService alertService;

    @PostMapping("/sos")
    public ResponseEntity<AlertDTO> sendSOS(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody AlertDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(alertService.createSOS(user, dto));
    }

    @GetMapping("/nearby")
    public ResponseEntity<List<AlertDTO>> getNearby(
            @RequestParam double lat,
            @RequestParam double lng,
            @RequestParam(defaultValue = "5") double radius) {
        return ResponseEntity.ok(alertService.getNearbyAlerts(lat, lng, radius));
    }

    @GetMapping("/my")
    public ResponseEntity<List<AlertDTO>> getMyAlerts(
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(alertService.getMyAlerts(user.getId()));
    }

    @PutMapping("/{id}/resolve")
    public ResponseEntity<AlertDTO> resolveAlert(
            @AuthenticationPrincipal User user,
            @PathVariable Long id) {
        return ResponseEntity.ok(alertService.resolveAlert(id, user.getId()));
    }
}
