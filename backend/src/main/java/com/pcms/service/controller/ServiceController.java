package com.pcms.service.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.pcms.service.dto.ServiceRequest;
import com.pcms.service.dto.ServiceResponse;
import com.pcms.service.service.ServiceService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/admin/services")
public class ServiceController {

    private final ServiceService serviceService;

    public ServiceController(
            ServiceService serviceService) {

        this.serviceService = serviceService;
    }

    @PostMapping
    public ResponseEntity<ServiceResponse>
            addService(
                    @Valid
                    @RequestBody
                    ServiceRequest request) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                        serviceService.addService(
                                request
                        )
                );
    }

    @GetMapping
    public ResponseEntity<List<ServiceResponse>>
            getAllServices() {

        return ResponseEntity.ok(
                serviceService.getAllServices()
        );
    }

    @GetMapping("/{serviceId}")
    public ResponseEntity<ServiceResponse>
            getServiceById(
                    @PathVariable
                    Long serviceId) {

        return ResponseEntity.ok(
                serviceService.getServiceById(
                        serviceId
                )
        );
    }

    @PutMapping("/{serviceId}")
    public ResponseEntity<ServiceResponse>
            updateService(
                    @PathVariable
                    Long serviceId,

                    @Valid
                    @RequestBody
                    ServiceRequest request) {

        return ResponseEntity.ok(
                serviceService.updateService(
                        serviceId,
                        request
                )
        );
    }

    @PutMapping("/{serviceId}/activate")
    public ResponseEntity<ServiceResponse>
            activateService(
                    @PathVariable
                    Long serviceId) {

        return ResponseEntity.ok(
                serviceService.activateService(
                        serviceId
                )
        );
    }

    @PutMapping("/{serviceId}/deactivate")
    public ResponseEntity<ServiceResponse>
            deactivateService(
                    @PathVariable
                    Long serviceId) {

        return ResponseEntity.ok(
                serviceService.deactivateService(
                        serviceId
                )
        );
    }
}