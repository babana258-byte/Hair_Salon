package com.mushue.service;

import com.mushue.entity.Staff;
import com.mushue.repository.StaffRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class StaffService {

    @Autowired
    private StaffRepository staffRepository;

    // 取得所有員工
    public List<Staff> getAllStaff() {
        return staffRepository.findAll();
    }

    // 取得所有在職員工
    public List<Staff> getActiveStaff() {
        return staffRepository.findByIsActiveTrue();
    }

    // 用ID取得員工
    public Optional<Staff> getStaffById(Integer id) {
        return staffRepository.findById(id);
    }

    // 新增員工
    public Staff createStaff(Staff staff) {
        return staffRepository.save(staff);
    }

    // 更新員工
    public Staff updateStaff(Integer id, Staff updatedStaff) {
        return staffRepository.findById(id).map(staff -> {
            staff.setName(updatedStaff.getName());
            staff.setPhone(updatedStaff.getPhone());
            staff.setTitle(updatedStaff.getTitle());
            staff.setHireDate(updatedStaff.getHireDate());
            staff.setSpecialty(updatedStaff.getSpecialty());
            staff.setNotes(updatedStaff.getNotes());
            return staffRepository.save(staff);
        }).orElseThrow(() -> new RuntimeException("員工不存在，ID：" + id));
    }

    // 停用員工（不直接刪除）
    public Staff deactivateStaff(Integer id) {
        return staffRepository.findById(id).map(staff -> {
            staff.setIsActive(false);
            return staffRepository.save(staff);
        }).orElseThrow(() -> new RuntimeException("員工不存在，ID：" + id));
    }
}
