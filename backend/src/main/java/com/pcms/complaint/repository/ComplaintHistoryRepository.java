package com.pcms.complaint.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.pcms.complaint.entity.Complaint;
import com.pcms.complaint.entity.ComplaintHistory;

public interface ComplaintHistoryRepository extends JpaRepository<ComplaintHistory, Long> {
    List<ComplaintHistory> findByComplaintOrderByCreatedAtAsc(Complaint complaint);
}
