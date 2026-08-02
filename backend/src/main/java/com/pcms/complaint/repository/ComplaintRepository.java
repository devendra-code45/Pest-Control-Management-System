package com.pcms.complaint.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.pcms.complaint.entity.Complaint;
import com.pcms.user.entity.User;

public interface ComplaintRepository extends JpaRepository<Complaint, Long> {
    List<Complaint> findByCustomerOrderByCreatedAtDesc(User customer);
    List<Complaint> findAllByOrderByCreatedAtDesc();
    Optional<Complaint> findByComplaintNumber(String complaintNumber);
    Optional<Complaint> findByComplaintNumberAndCustomer(String complaintNumber, User customer);
}
