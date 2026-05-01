package com.raahi.dto;

import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class DashboardStatsDTO {
    private long activeAlerts;
    private long contactsCount;
    private long locationsCount;
    private long nearbyIncidents;
    private long myIncidentsCount;
}
