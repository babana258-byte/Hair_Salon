package com.mushue.controller;

import com.mushue.entity.ServiceRecord;
import com.mushue.service.ServiceRecordService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/service-records")
@CrossOrigin(origins = "*")
public class ServiceRecordController {

    @Autowired
    private ServiceRecordService serviceRecordService;

    // 取得所有施作記錄
    @GetMapping
    public List<ServiceRecord> getAllServiceRecords() {
        return serviceRecordService.getAllServiceRecords();
    }

    // 用ID取得施作記錄
    @GetMapping("/{id}")
    public ResponseEntity<ServiceRecord> getServiceRecordById(@PathVariable Integer id) {
        return serviceRecordService.getServiceRecordById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // 取得某位客戶的施作記錄
    @GetMapping("/customer/{customerId}")
    public List<ServiceRecord> getServiceRecordsByCustomer(@PathVariable Integer customerId) {
        return serviceRecordService.getServiceRecordsByCustomerId(customerId);
    }

    // 取得某位員工的施作記錄
    @GetMapping("/staff/{staffId}")
    public List<ServiceRecord> getServiceRecordsByStaff(@PathVariable Integer staffId) {
        return serviceRecordService.getServiceRecordsByStaffId(staffId);
    }

    // 新增施作記錄
    @PostMapping
    public ServiceRecord createServiceRecord(@RequestBody ServiceRecord serviceRecord) {
        return serviceRecordService.createServiceRecord(serviceRecord);
    }

    // 更新施作記錄
    @PutMapping("/{id}")
    public ResponseEntity<ServiceRecord> updateServiceRecord(@PathVariable Integer id,
                                                              @RequestBody ServiceRecord serviceRecord) {
        try {
            return ResponseEntity.ok(serviceRecordService.updateServiceRecord(id, serviceRecord));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // 刪除施作記錄
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteServiceRecord(@PathVariable Integer id) {
        serviceRecordService.deleteServiceRecord(id);
        return ResponseEntity.noContent().build();
    }
}
