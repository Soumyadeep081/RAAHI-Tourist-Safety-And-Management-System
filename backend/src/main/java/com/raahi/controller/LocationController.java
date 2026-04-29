package com.raahi.controller;

import com.raahi.dto.LocationDTO;
import com.raahi.entity.User;
import com.raahi.service.LocationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/locations")
@RequiredArgsConstructor
public class LocationController {

    private final LocationService locationService;

    @PostMapping
    public ResponseEntity<LocationDTO> updateLocation(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody LocationDTO dto) {
        return ResponseEntity.ok(locationService.saveLocation(user, dto));
    }

    @PostMapping("/batch")
    public ResponseEntity<List<LocationDTO>> batchSync(
            @AuthenticationPrincipal User user,
            @RequestBody List<LocationDTO> dtos) {
        return ResponseEntity.ok(locationService.saveBatch(user, dtos));
    }

    @GetMapping
    public ResponseEntity<List<LocationDTO>> getMyLocations(
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(locationService.getRecentLocations(user.getId()));
    }
}
