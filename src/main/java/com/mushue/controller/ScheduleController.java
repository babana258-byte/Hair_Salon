package com.mushue.controller;

import com.mushue.entity.Schedule;
import com.mushue.service.ScheduleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/schedules")
@CrossOrigin(origins = "*")
public class ScheduleController {

    @Autowired
    private ScheduleService scheduleService;

    // 取得所有班表
    @GetMapping
    public List<Schedule> getAllSchedules() {
        return scheduleService.getAllSchedules();
    }

    // 用ID取得班表
    @GetMapping("/{id}")
    public ResponseEntity<Schedule> getScheduleById(@PathVariable Integer id) {
        return scheduleService.getScheduleById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // 取得某位員工的班表
    @GetMapping("/staff/{staffId}")
    public List<Schedule> getSchedulesByStaff(@PathVariable Integer staffId) {
        return scheduleService.getSchedulesByStaffId(staffId);
    }

    // 取得某個日期的班表
    @GetMapping("/date/{date}")
    public List<Schedule> getSchedulesByDate(@PathVariable LocalDate date) {
        return scheduleService.getSchedulesByDate(date);
    }

    // 取得某位員工某段時間內的班表
    @GetMapping("/staff/{staffId}/between")
    public List<Schedule> getSchedulesByStaffBetween(@PathVariable Integer staffId,
                                                      @RequestParam LocalDate start,
                                                      @RequestParam LocalDate end) {
        return scheduleService.getSchedulesByStaffIdBetween(staffId, start, end);
    }

    // 新增班表
    @PostMapping
    public Schedule createSchedule(@RequestBody Schedule schedule) {
        return scheduleService.createSchedule(schedule);
    }

    // 更新班表
    @PutMapping("/{id}")
    public ResponseEntity<Schedule> updateSchedule(@PathVariable Integer id,
                                                    @RequestBody Schedule schedule) {
        try {
            return ResponseEntity.ok(scheduleService.updateSchedule(id, schedule));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // 刪除班表
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSchedule(@PathVariable Integer id) {
        scheduleService.deleteSchedule(id);
        return ResponseEntity.noContent().build();
    }
}
