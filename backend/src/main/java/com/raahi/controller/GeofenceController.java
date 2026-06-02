package com.raahi.controller;

import com.raahi.entity.Geofence;
import com.raahi.service.GeofenceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/geofences")
@RequiredArgsConstructor
public class GeofenceController {

    private final GeofenceService geofenceService;

    @GetMapping
    public ResponseEntity<List<Geofence>> getAllGeofences() {
        return ResponseEntity.ok(geofenceService.getAllGeofences());
    }

    @PostMapping
    public ResponseEntity<Geofence> createGeofence(@RequestBody Geofence geofence) {
        return ResponseEntity.ok(geofenceService.saveGeofence(geofence));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteGeofence(@PathVariable Long id) {
        geofenceService.deleteGeofence(id);
        return ResponseEntity.ok().build();
    }
}
