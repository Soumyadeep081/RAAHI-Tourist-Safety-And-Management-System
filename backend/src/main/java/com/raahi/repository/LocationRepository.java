package com.raahi.repository;

import com.raahi.entity.Location;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface LocationRepository extends JpaRepository<Location, Long> {
    List<Location> findTop50ByUserIdOrderByRecordedAtDesc(Long userId);
    long countByUserId(Long userId);
}
