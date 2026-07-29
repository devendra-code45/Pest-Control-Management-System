package com.pcms.technician.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.pcms.technician.entity.Technician;
import com.pcms.technician.entity.TechnicianStatus;

@Repository
public interface TechnicianRepository
        extends JpaRepository<Technician, Long> {

    Optional<Technician> findByEmailIgnoreCase(
            String email
    );

    Optional<Technician> findByPhone(
            String phone
    );

    boolean existsByEmailIgnoreCase(
            String email
    );

    boolean existsByPhone(
            String phone
    );

    List<Technician> findByStatusOrderByFullNameAsc(
            TechnicianStatus status
    );

    List<Technician> findAllByOrderByCreatedAtDesc();
}