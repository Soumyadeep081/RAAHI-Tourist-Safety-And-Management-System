package com.raahi.service;

import com.raahi.dto.LocationDTO;
import com.raahi.entity.Location;
import com.raahi.entity.User;
import com.raahi.repository.LocationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class LocationService {

    private final LocationRepository locationRepository;

    public LocationDTO saveLocation(User user, LocationDTO dto) {
        Location location = Location.builder()
                .user(user)
                .latitude(dto.getLatitude())
                .longitude(dto.getLongitude())
                .accuracy(dto.getAccuracy())
                .recordedAt(dto.getTimestamp())
                .build();

        location = locationRepository.save(location);

        return LocationDTO.builder()
                .id(location.getId())
                .userId(user.getId())
                .latitude(location.getLatitude())
                .longitude(location.getLongitude())
                .accuracy(location.getAccuracy())
                .timestamp(location.getRecordedAt())
                .build();
    }

    public List<LocationDTO> saveBatch(User user, List<LocationDTO> dtos) {
        return dtos.stream()
                .map(dto -> saveLocation(user, dto))
                .collect(Collectors.toList());
    }

    public List<LocationDTO> getRecentLocations(Long userId) {
        return locationRepository.findTop50ByUserIdOrderByRecordedAtDesc(userId)
                .stream()
                .map(loc -> LocationDTO.builder()
                        .id(loc.getId())
                        .userId(userId)
                        .latitude(loc.getLatitude())
                        .longitude(loc.getLongitude())
                        .accuracy(loc.getAccuracy())
                        .timestamp(loc.getRecordedAt())
                        .build())
                .collect(Collectors.toList());
    }
}
