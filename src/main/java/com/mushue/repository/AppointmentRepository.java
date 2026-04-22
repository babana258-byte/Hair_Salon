package com.mushue.repository;

import com.mushue.entity.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Integer> {

    // 查詢某位客戶的所有預約
    List<Appointment> findByCustomerId(Integer customerId);

    // 查詢某位員工的所有預約
    List<Appointment> findByStaffId(Integer staffId);

    // 查詢某段時間內的預約
    List<Appointment> findByAppointmentDatetimeBetween(LocalDateTime start, LocalDateTime end);

    // 查詢尚未發送提醒的預約
    List<Appointment> findByReminderSentFalse();

    // 查詢某位員工特定狀態的預約
    List<Appointment> findByStaffIdAndStatus(Integer staffId, Appointment.Status status);
}
