package com.mushue.repository;

import com.mushue.entity.ServiceRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ServiceRecordRepository extends JpaRepository<ServiceRecord, Integer> {

    // 查詢某位客戶的所有施作記錄
    List<ServiceRecord> findByCustomerId(Integer customerId);

    // 查詢某位員工的所有施作記錄
    List<ServiceRecord> findByStaffId(Integer staffId);

    // 查詢某筆預約的施作記錄
    List<ServiceRecord> findByAppointmentId(Integer appointmentId);
}
