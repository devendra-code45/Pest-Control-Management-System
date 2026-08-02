package com.pcms.report.dto;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

public class ReportOverviewResponse {

    private LocalDate startDate;
    private LocalDate endDate;
    private ReportSummaryResponse summary;
    private List<ReportResponse> reports = new ArrayList<>();

    public ReportOverviewResponse() {
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }

    public ReportSummaryResponse getSummary() {
        return summary;
    }

    public void setSummary(ReportSummaryResponse summary) {
        this.summary = summary;
    }

    public List<ReportResponse> getReports() {
        return reports;
    }

    public void setReports(List<ReportResponse> reports) {
        this.reports = reports;
    }
}
