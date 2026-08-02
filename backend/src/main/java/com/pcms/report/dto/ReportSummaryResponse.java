package com.pcms.report.dto;

import java.math.BigDecimal;

public class ReportSummaryResponse {

    private BigDecimal totalRevenue;
    private long completedServices;
    private long openComplaints;
    private double collectionRate;
    private long totalBookings;
    private long totalCustomers;
    private long totalTechnicians;
    private long totalPayments;
    private long activeServices;

    public ReportSummaryResponse() {
    }

    public BigDecimal getTotalRevenue() {
        return totalRevenue;
    }

    public void setTotalRevenue(BigDecimal totalRevenue) {
        this.totalRevenue = totalRevenue;
    }

    public long getCompletedServices() {
        return completedServices;
    }

    public void setCompletedServices(long completedServices) {
        this.completedServices = completedServices;
    }

    public long getOpenComplaints() {
        return openComplaints;
    }

    public void setOpenComplaints(long openComplaints) {
        this.openComplaints = openComplaints;
    }

    public double getCollectionRate() {
        return collectionRate;
    }

    public void setCollectionRate(double collectionRate) {
        this.collectionRate = collectionRate;
    }

    public long getTotalBookings() {
        return totalBookings;
    }

    public void setTotalBookings(long totalBookings) {
        this.totalBookings = totalBookings;
    }

    public long getTotalCustomers() {
        return totalCustomers;
    }

    public void setTotalCustomers(long totalCustomers) {
        this.totalCustomers = totalCustomers;
    }

    public long getTotalTechnicians() {
        return totalTechnicians;
    }

    public void setTotalTechnicians(long totalTechnicians) {
        this.totalTechnicians = totalTechnicians;
    }

    public long getTotalPayments() {
        return totalPayments;
    }

    public void setTotalPayments(long totalPayments) {
        this.totalPayments = totalPayments;
    }

    public long getActiveServices() {
        return activeServices;
    }

    public void setActiveServices(long activeServices) {
        this.activeServices = activeServices;
    }
}
