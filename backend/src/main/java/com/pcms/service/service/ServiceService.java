package com.pcms.service.service;

import java.util.List;

import com.pcms.service.dto.ServiceRequest;
import com.pcms.service.dto.ServiceResponse;

public interface ServiceService {

    ServiceResponse addService(
            ServiceRequest request
    );
    List<ServiceResponse> getActiveServices();

    List<ServiceResponse> getAllServices();

    ServiceResponse getServiceById(
            Long serviceId
    );

    ServiceResponse updateService(
            Long serviceId,
            ServiceRequest request
    );

    ServiceResponse activateService(
            Long serviceId
    );

    ServiceResponse deactivateService(
            Long serviceId
    );
}