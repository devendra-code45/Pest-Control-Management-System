package com.pcms.service.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.pcms.service.entity.PestService;

public interface ServiceRepository
        extends JpaRepository<PestService, Long> {

    List<PestService>
            findAllByOrderByCreatedAtDesc();

    List<PestService>
            findByActiveTrueOrderByCreatedAtDesc();

    Optional<PestService>
            findByNameIgnoreCase(
                    String name
            );
}