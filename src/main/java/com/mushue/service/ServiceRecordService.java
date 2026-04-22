package com.mushue.service;

import com.mushue.entity.ServiceRecord;
import com.mushue.repository.ServiceRecordRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class ServiceRecordService {

    @Autowired
    private ServiceRecordRepository serviceRecordRepository;

    // 取得所有施作記錄
    public List<ServiceRecord> getAllServiceRecords() {
        return serviceRecordRepository.findAll();
    }

    // 用ID取得施作記錄
    public Optional<ServiceRecord> getServiceRecordById(Integer id) {
        return serviceRecordRepository.findById(id);
    }

    // 取得某位客戶的所有施作記錄
    public List<ServiceRecord> getServiceRecordsByCustomerId(Integer customerId) {
        return serviceRecordRepository.findByCustomerId(customerId);
    }

    // 取得某位員工的所有施作記錄
    public List<ServiceRecord> getServiceRecordsByStaffId(Integer staffId) {
        return serviceRecordRepository.findByStaffId(staffId);
    }

    // 新增施作記錄
    public ServiceRecord createServiceRecord(ServiceRecord serviceRecord) {
        return serviceRecordRepository.save(serviceRecord);
    }

    // 更新施作記錄
    public ServiceRecord updateServiceRecord(Integer id, ServiceRecord updatedRecord) {
        return serviceRecordRepository.findById(id).map(record -> {
            record.setColorBrand(updatedRecord.getColorBrand());
            record.setColorCode(updatedRecord.getColorCode());
            record.setPermSolution(updatedRecord.getPermSolution());
            record.setNotes(updatedRecord.getNotes());
            return serviceRecordRepository.save(record);
        }).orElseThrow(() -> new RuntimeException("施作記錄不存在，ID：" + id));
    }

    // 刪除施作記錄
    public void deleteServiceRecord(Integer id) {
        serviceRecordRepository.deleteById(id);
    }
}
