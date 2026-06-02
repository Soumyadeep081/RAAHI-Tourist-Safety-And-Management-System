package com.raahi.service;

import com.raahi.entity.Geofence;
import com.raahi.repository.GeofenceRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class GeofenceService {

    private final GeofenceRepository geofenceRepository;

    public List<Geofence> getAllGeofences() {
        return geofenceRepository.findAll();
    }

    public Geofence saveGeofence(Geofence geofence) {
        return geofenceRepository.save(geofence);
    }

    public void deleteGeofence(Long id) {
        geofenceRepository.deleteById(id);
    }

    @PostConstruct
    public void seedGeofences() {
        if (geofenceRepository.count() == 0) {
            // Seed sample geofences
            geofenceRepository.save(Geofence.builder()
                    .name("Red Zone - High Incident Area")
                    .latitude(28.6200)
                    .longitude(77.2100)
                    .radius(400) // 400 meters
                    .zoneType("RED")
                    .description("High pickpocketing and minor crime reported. Keep belongings secure.")
                    .build());

            geofenceRepository.save(Geofence.builder()
                    .name("Yellow Zone - Tourist Crowded Market")
                    .latitude(28.6100)
                    .longitude(77.2200)
                    .radius(500)
                    .zoneType("YELLOW")
                    .description("Very crowded area. Stay alert and watch out for scams.")
                    .build());

            geofenceRepository.save(Geofence.builder()
                    .name("Green Zone - Safe Embassy Enclave")
                    .latitude(28.6000)
                    .longitude(77.2000)
                    .radius(800)
                    .zoneType("GREEN")
                    .description("Highly secure diplomatic area. 24/7 police patrolling.")
                    .build());

            geofenceRepository.save(Geofence.builder()
                    .name("Restricted - Military Cantonment Area")
                    .latitude(28.6300)
                    .longitude(77.1850)
                    .radius(600)
                    .zoneType("RED")
                    .description("Confidential military area. Strictly restricted zone - entry prohibited.")
                    .build());
            
            System.out.println("==================================================");
            System.out.println("Pre-populated 4 safety zones and geofences in DB.");
            System.out.println("==================================================");
        }
    }
}
