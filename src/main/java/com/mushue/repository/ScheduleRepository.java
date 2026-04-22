package com.mushue.repository;

import com.mushue.entity.Schedule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface ScheduleRepository extends JpaRepository<Schedule, Integer> {

    // 查詢某位員工的所有班表
    List<Schedule> findByStaffId(Integer staffId);

    // 查詢某個日期的所有班表
    List<Schedule> findByWorkDate(LocalDate workDate);

    // 查詢某位員工某段時間內的班表
    List<Schedule> findByStaffIdAndWorkDateBetween(Integer staffId, LocalDate start, LocalDate end);

    // 查詢某位員工的休假日
    List<Schedule> findByStaffIdAndIsDayoffTrue(Integer staffId);
}
