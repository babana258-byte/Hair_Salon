package com.mushue.controller;

import com.mushue.entity.Staff;
import com.mushue.service.StaffService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/staff")
@CrossOrigin(origins = "*")
public class StaffController {

    @Autowired
    private StaffService staffService;

    // 取得所有員工
    @GetMapping
    public List<Staff> getAllStaff() {
        return staffService.getAllStaff();
    }

    // 取得所有在職員工
    @GetMapping("/active")
    public List<Staff> getActiveStaff() {
        return staffService.getActiveStaff();
    }

    // 用ID取得員工
    @GetMapping("/{id}")
    public ResponseEntity<Staff> getStaffById(@PathVariable Integer id) {
        return staffService.getStaffById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // 新增員工
    @PostMapping
    public Staff createStaff(@RequestBody Staff staff) {
        return staffService.createStaff(staff);
    }

    // 更新員工
    @PutMapping("/{id}")
    public ResponseEntity<Staff> updateStaff(@PathVariable Integer id,
                                              @RequestBody Staff staff) {
        try {
            return ResponseEntity.ok(staffService.updateStaff(id, staff));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // 停用員工
    @PutMapping("/{id}/deactivate")
    public ResponseEntity<Staff> deactivateStaff(@PathVariable Integer id) {
        try {
            return ResponseEntity.ok(staffService.deactivateStaff(id));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
