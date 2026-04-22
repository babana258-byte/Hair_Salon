package com.mushue.service;

import com.mushue.entity.Appointment;
import com.mushue.repository.AppointmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class AppointmentService {

    @Autowired
    private AppointmentRepository appointmentRepository;

    // 取得所有預約
    public List<Appointment> getAllAppointments() {
        return appointmentRepository.findAll();
    }

    // 用ID取得預約
    public Optional<Appointment> getAppointmentById(Integer id) {
        return appointmentRepository.findById(id);
    }

    // 取得某位客戶的所有預約
    public List<Appointment> getAppointmentsByCustomerId(Integer customerId) {
        return appointmentRepository.findByCustomerId(customerId);
    }

    // 取得某位員工的所有預約
    public List<Appointment> getAppointmentsByStaffId(Integer staffId) {
        return appointmentRepository.findByStaffId(staffId);
    }

    // 取得某段時間內的預約
    public List<Appointment> getAppointmentsBetween(LocalDateTime start, LocalDateTime end) {
        return appointmentRepository.findByAppointmentDatetimeBetween(start, end);
    }

    // 新增預約
    public Appointment createAppointment(Appointment appointment) {
        return appointmentRepository.save(appointment);
    }

    // 更新預約狀態
    public Appointment updateStatus(Integer id, Appointment.Status status) {
        return appointmentRepository.findById(id).map(appointment -> {
            appointment.setStatus(status);
            return appointmentRepository.save(appointment);
        }).orElseThrow(() -> new RuntimeException("預約不存在，ID：" + id));
    }

    // 更新提醒已發送
    public Appointment markReminderSent(Integer id) {
        return appointmentRepository.findById(id).map(appointment -> {
            appointment.setReminderSent(true);
            return appointmentRepository.save(appointment);
        }).orElseThrow(() -> new RuntimeException("預約不存在，ID：" + id));
    }

    // 刪除預約
    public void deleteAppointment(Integer id) {
        appointmentRepository.deleteById(id);
    }
}
