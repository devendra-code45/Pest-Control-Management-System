package com.pcms.service.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.pcms.service.dto.ServiceResponse;
import com.pcms.service.service.ServiceService;

@RestController
@RequestMapping("/api/customer/services")
public class CustomerServiceController {

    private final ServiceService serviceService;

    public CustomerServiceController(
            ServiceService serviceService) {

        this.serviceService = serviceService;
    }

    @GetMapping
    public ResponseEntity<List<ServiceResponse>>
            getAvailableServices() {

        List<ServiceResponse> activeServices =
                serviceService
                        .getAllServices()
                        .stream()
                        .filter(service ->
                                Boolean.TRUE.equals(
                                        service.getActive()
                                )
                        )
                        .toList();

        return ResponseEntity.ok(activeServices);
    }
}
