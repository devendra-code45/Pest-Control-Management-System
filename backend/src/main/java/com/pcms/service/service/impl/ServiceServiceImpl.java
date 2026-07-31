package com.pcms.service.service.impl;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.pcms.service.dto.ServiceRequest;
import com.pcms.service.dto.ServiceResponse;
import com.pcms.service.entity.PestService;
import com.pcms.service.repository.ServiceRepository;
import com.pcms.service.service.ServiceService;

@Service
public class ServiceServiceImpl
        implements ServiceService {

    private final ServiceRepository serviceRepository;

    public ServiceServiceImpl(
            ServiceRepository serviceRepository
    ) {
        this.serviceRepository =
                serviceRepository;
    }

    @Override
    @Transactional
    public ServiceResponse addService(
            ServiceRequest request
    ) {

        validateDuplicateName(
                request.getName(),
                null
        );

        PestService service =
                new PestService();

        applyRequest(
                service,
                request
        );

        if (request.getActive() == null) {
            service.setActive(true);
        }

        return convertToResponse(
                serviceRepository.save(service)
        );
    }

    @Override
    @Transactional(readOnly = true)
    public List<ServiceResponse>
            getActiveServices() {

        return serviceRepository
                .findByActiveTrueOrderByCreatedAtDesc()
                .stream()
                .map(this::convertToResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<ServiceResponse>
            getAllServices() {

        return serviceRepository
                .findAllByOrderByCreatedAtDesc()
                .stream()
                .map(this::convertToResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public ServiceResponse getServiceById(
            Long serviceId
    ) {

        return convertToResponse(
                findServiceById(serviceId)
        );
    }

    @Override
    @Transactional
    public ServiceResponse updateService(
            Long serviceId,
            ServiceRequest request
    ) {

        PestService service =
                findServiceById(serviceId);

        validateDuplicateName(
                request.getName(),
                serviceId
        );

        applyRequest(
                service,
                request
        );

        return convertToResponse(
                serviceRepository.save(service)
        );
    }

    @Override
    @Transactional
    public ServiceResponse activateService(
            Long serviceId
    ) {

        PestService service =
                findServiceById(serviceId);

        service.setActive(true);

        return convertToResponse(
                serviceRepository.save(service)
        );
    }

    @Override
    @Transactional
    public ServiceResponse deactivateService(
            Long serviceId
    ) {

        PestService service =
                findServiceById(serviceId);

        service.setActive(false);

        return convertToResponse(
                serviceRepository.save(service)
        );
    }

    private PestService findServiceById(
            Long serviceId
    ) {

        return serviceRepository
                .findById(serviceId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Service not found."
                        )
                );
    }

    private void validateDuplicateName(
            String name,
            Long currentServiceId
    ) {

        serviceRepository
                .findByNameIgnoreCase(
                        name.trim()
                )
                .ifPresent(existing -> {

                    boolean belongsToAnother =
                            currentServiceId == null
                                    || !existing
                                            .getId()
                                            .equals(
                                                    currentServiceId
                                            );

                    if (belongsToAnother) {
                        throw new RuntimeException(
                                "Service name is already registered."
                        );
                    }
                });
    }

    private void applyRequest(
            PestService service,
            ServiceRequest request
    ) {

        service.setName(
                request.getName().trim()
        );

        service.setCategory(
                request.getCategory().trim()
        );

        service.setDescription(
                request.getDescription().trim()
        );

        service.setDuration(
                request.getDuration().trim()
        );

        service.setPrice(
                request.getPrice()
        );

        if (request.getActive() != null) {
            service.setActive(
                    request.getActive()
            );
        }

        /*
         * During update, an empty image keeps
         * the existing service image.
         */
        if (request.getServiceImage() != null
                && !request
                        .getServiceImage()
                        .isBlank()) {

            service.setServiceImage(
                    request.getServiceImage()
            );
        }
    }

    private ServiceResponse convertToResponse(
            PestService service
    ) {

        ServiceResponse response =
                new ServiceResponse();

        response.setId(
                service.getId()
        );

        response.setName(
                service.getName()
        );

        response.setCategory(
                service.getCategory()
        );

        response.setDescription(
                service.getDescription()
        );

        response.setDuration(
                service.getDuration()
        );

        response.setPrice(
                service.getPrice()
        );

        response.setActive(
                service.getActive()
        );

        response.setServiceImage(
                service.getServiceImage()
        );

        response.setCreatedAt(
                service.getCreatedAt()
        );

        response.setUpdatedAt(
                service.getUpdatedAt()
        );

        return response;
    }
}