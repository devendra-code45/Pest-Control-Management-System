package com.pcms.technician.service;

import java.util.List;

import com.pcms.technician.dto.TechnicianRequest;
import com.pcms.technician.dto.TechnicianResponse;

public interface TechnicianService {

    TechnicianResponse addTechnician(
            TechnicianRequest request
    );

    List<TechnicianResponse> getAllTechnicians();

    List<TechnicianResponse> getAvailableTechnicians();

    TechnicianResponse getTechnicianById(
            Long technicianId
    );

    TechnicianResponse updateTechnician(
            Long technicianId,
            TechnicianRequest request
    );

    TechnicianResponse activateTechnician(
            Long technicianId
    );

    TechnicianResponse deactivateTechnician(
            Long technicianId
    );
}