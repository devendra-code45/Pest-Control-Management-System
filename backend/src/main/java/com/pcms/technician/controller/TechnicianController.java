package com.pcms.technician.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.pcms.technician.dto.TechnicianRequest;
import com.pcms.technician.dto.TechnicianResponse;
import com.pcms.technician.service.TechnicianService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/admin/technicians")
@Validated
public class TechnicianController {

    private final TechnicianService technicianService;

    public TechnicianController(
            TechnicianService technicianService) {

        this.technicianService = technicianService;
    }

    @PostMapping
    public ResponseEntity<TechnicianResponse>
            addTechnician(
                    @Valid
                    @RequestBody
                    TechnicianRequest request) {

        TechnicianResponse response =
                technicianService.addTechnician(
                        request
                );

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    @GetMapping
    public ResponseEntity<List<TechnicianResponse>>
            getAllTechnicians() {

        return ResponseEntity.ok(
                technicianService
                        .getAllTechnicians()
        );
    }

    @GetMapping("/available")
    public ResponseEntity<List<TechnicianResponse>>
            getAvailableTechnicians() {

        return ResponseEntity.ok(
                technicianService
                        .getAvailableTechnicians()
        );
    }

    @GetMapping("/{technicianId}")
    public ResponseEntity<TechnicianResponse>
            getTechnicianById(
                    @PathVariable
                    Long technicianId) {

        return ResponseEntity.ok(
                technicianService
                        .getTechnicianById(
                                technicianId
                        )
        );
    }

    @PutMapping("/{technicianId}")
    public ResponseEntity<TechnicianResponse>
            updateTechnician(
                    @PathVariable
                    Long technicianId,

                    @Valid
                    @RequestBody
                    TechnicianRequest request) {

        return ResponseEntity.ok(
                technicianService
                        .updateTechnician(
                                technicianId,
                                request
                        )
        );
    }

    @PutMapping("/{technicianId}/activate")
    public ResponseEntity<TechnicianResponse>
            activateTechnician(
                    @PathVariable
                    Long technicianId) {

        return ResponseEntity.ok(
                technicianService
                        .activateTechnician(
                                technicianId
                        )
        );
    }

    @DeleteMapping("/{technicianId}")
    public ResponseEntity<TechnicianResponse>
            deactivateTechnician(
                    @PathVariable
                    Long technicianId) {

        return ResponseEntity.ok(
                technicianService
                        .deactivateTechnician(
                                technicianId
                        )
        );
    }
}