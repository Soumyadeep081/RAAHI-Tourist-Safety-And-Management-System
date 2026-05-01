package com.raahi.repository;

import com.raahi.entity.Incident;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface IncidentRepository extends JpaRepository<Incident, Long> {

    List<Incident> findByUserIdOrderByCreatedAtDesc(Long userId);
    long countByUserId(Long userId);

    @Query("SELECT i FROM Incident i " +
           "WHERE i.latitude  BETWEEN :minLat AND :maxLat " +
           "AND   i.longitude BETWEEN :minLng AND :maxLng " +
           "ORDER BY i.createdAt DESC")
    List<Incident> findNearby(
            @Param("minLat") double minLat,
            @Param("maxLat") double maxLat,
            @Param("minLng") double minLng,
            @Param("maxLng") double maxLng);
}
