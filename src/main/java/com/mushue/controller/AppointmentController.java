package com.mushue.controller;

import com.mushue.entity.Appointment;
import com.mushue.service.AppointmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/appointments")
@CrossOrigin(origins = "*")
public class AppointmentController {

    @Autowired
    private AppointmentService appointmentService;

    // 取得所有預約
    @GetMapping
    public List<Appointment> getAllAppointments() {
        return appointmentService.getAllAppointments();
    }

    // 用ID取得預約
    @GetMapping("/{id}")
    public ResponseEntity<Appointment> getAppointmentById(@PathVariable Integer id) {
        return appointmentService.getAppointmentById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // 取得某位客戶的預約
    @GetMapping("/customer/{customerId}")
    public List<Appointment> getAppointmentsByCustomer(@PathVariable Integer customerId) {
        return appointmentService.getAppointmentsByCustomerId(customerId);
    }

    // 取得某位員工的預約
    @GetMapping("/staff/{staffId}")
    public List<Appointment> getAppointmentsByStaff(@PathVariable Integer staffId) {
        return appointmentService.getAppointmentsByStaffId(staffId);
    }

    // 取得某段時間內的預約
    @GetMapping("/between")
    public List<Appointment> getAppointmentsBetween(@RequestParam LocalDateTime start,
                                                     @RequestParam LocalDateTime end) {
        return appointmentService.getAppointmentsBetween(start, end);
    }

    // 新增預約
    @PostMapping
    public Appointment createAppointment(@RequestBody Appointment appointment) {
        return appointmentService.createAppointment(appointment);
    }

    // 更新預約狀態
    @PutMapping("/{id}/status")
    public ResponseEntity<Appointment> updateStatus(@PathVariable Integer id,
                                                     @RequestParam Appointment.Status status) {
        try {
            return ResponseEntity.ok(appointmentService.updateStatus(id, status));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // 標記提醒已發送
    @PutMapping("/{id}/reminder")
    public ResponseEntity<Appointment> markReminderSent(@PathVariable Integer id) {
        try {
            return ResponseEntity.ok(appointmentService.markReminderSent(id));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // 刪除預約
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAppointment(@PathVariable Integer id) {
        appointmentService.deleteAppointment(id);
        return ResponseEntity.noContent().build();
    }
}
