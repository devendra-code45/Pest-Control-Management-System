package com.pcms.report.service;

import java.time.LocalDate;

import com.pcms.report.dto.ReportOverviewResponse;
import com.pcms.report.dto.ReportResponse;
import com.pcms.report.dto.ReportSummaryResponse;

public interface ReportService {

    ReportOverviewResponse getOverview(
            LocalDate startDate,
            LocalDate endDate
    );

    ReportSummaryResponse getSummary(
            LocalDate startDate,
            LocalDate endDate
    );

    ReportResponse getReport(
            String reportType,
            LocalDate startDate,
            LocalDate endDate
    );
}
