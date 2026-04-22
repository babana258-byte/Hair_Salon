package com.mushue.service;

import com.mushue.entity.Schedule;
import com.mushue.repository.ScheduleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class ScheduleService {

    @Autowired
    private ScheduleRepository scheduleRepository;

    // 取得所有班表
    public List<Schedule> getAllSchedules() {
        return scheduleRepository.findAll();
    }

    // 用ID取得班表
    public Optional<Schedule> getScheduleById(Integer id) {
        return scheduleRepository.findById(id);
    }

    // 取得某位員工的班表
    public List<Schedule> getSchedulesByStaffId(Integer staffId) {
        return scheduleRepository.findByStaffId(staffId);
    }

    // 取得某個日期的所有班表
    public List<Schedule> getSchedulesByDate(LocalDate date) {
        return scheduleRepository.findByWorkDate(date);
    }

    // 取得某位員工某段時間內的班表
    public List<Schedule> getSchedulesByStaffIdBetween(Integer staffId,
                                                        LocalDate start, LocalDate end) {
        return scheduleRepository.findByStaffIdAndWorkDateBetween(staffId, start, end);
    }

    // 新增班表
    public Schedule createSchedule(Schedule schedule) {
        return scheduleRepository.save(schedule);
    }

    // 更新班表
    public Schedule updateSchedule(Integer id, Schedule updatedSchedule) {
        return scheduleRepository.findById(id).map(schedule -> {
            schedule.setWorkDate(updatedSchedule.getWorkDate());
            schedule.setStartTime(updatedSchedule.getStartTime());
            schedule.setEndTime(updatedSchedule.getEndTime());
            schedule.setIsDayoff(updatedSchedule.getIsDayoff());
            return scheduleRepository.save(schedule);
        }).orElseThrow(() -> new RuntimeException("班表不存在，ID：" + id));
    }

    // 刪除班表
    public void deleteSchedule(Integer id) {
        scheduleRepository.deleteById(id);
    }
}
