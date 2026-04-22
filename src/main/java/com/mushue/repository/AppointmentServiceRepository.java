package com.mushue.repository;

import com.mushue.entity.AppointmentService;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface AppointmentServiceRepository extends JpaRepository<AppointmentService, Integer> {

    // 查詢某筆預約的所有服務
    List<AppointmentService> findByAppointmentId(Integer appointmentId);
}
