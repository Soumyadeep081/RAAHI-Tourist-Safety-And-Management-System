package com.raahi.repository;

import com.raahi.entity.Alert;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface AlertRepository extends JpaRepository<Alert, Long> {

    List<Alert> findByUserIdOrderByCreatedAtDesc(Long userId);
    long countByUserIdAndStatus(Long userId, Alert.AlertStatus status);

    List<Alert> findByStatusOrderByCreatedAtDesc(Alert.AlertStatus status);

    /**
     * Fetch active alerts within a bounding box (simple proximity).
     * The caller computes the lat/lng bounds from the radius.
     */
    @Query("SELECT a FROM Alert a WHERE a.status = 'ACTIVE' " +
           "AND a.latitude  BETWEEN :minLat AND :maxLat " +
           "AND a.longitude BETWEEN :minLng AND :maxLng " +
           "ORDER BY a.createdAt DESC")
    List<Alert> findNearbyActive(
            @Param("minLat") double minLat,
            @Param("maxLat") double maxLat,
            @Param("minLng") double minLng,
            @Param("maxLng") double maxLng);
}
