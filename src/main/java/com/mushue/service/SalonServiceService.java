package com.mushue.service;

import com.mushue.entity.Service;
import com.mushue.repository.ServiceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.List;
import java.util.Optional;

@org.springframework.stereotype.Service
public class SalonServiceService {

    @Autowired
    private ServiceRepository serviceRepository;

    // 取得所有服務項目
    public List<Service> getAllServices() {
        return serviceRepository.findAll();
    }

    // 用ID取得服務項目
    public Optional<Service> getServiceById(Integer id) {
        return serviceRepository.findById(id);
    }

    // 取得上架中的服務項目
    public List<Service> getActiveServices() {
        return serviceRepository.findByIsActiveTrue();
    }

    // 用類別查詢服務項目
    public List<Service> getServicesByCategory(Service.Category category) {
        return serviceRepository.findByCategory(category);
    }

    // 新增服務項目
    public Service createService(Service service) {
        return serviceRepository.save(service);
    }

    // 更新服務項目
    public Service updateService(Integer id, Service updatedService) {
        return serviceRepository.findById(id).map(service -> {
            service.setName(updatedService.getName());
            service.setCategory(updatedService.getCategory());
            service.setPrice(updatedService.getPrice());
            service.setDurationMinutes(updatedService.getDurationMinutes());
            service.setIsActive(updatedService.getIsActive());
            return serviceRepository.save(service);
        }).orElseThrow(() -> new RuntimeException("服務項目不存在，ID：" + id));
    }

    // 下架服務項目
    public Service deactivateService(Integer id) {
        return serviceRepository.findById(id).map(service -> {
            service.setIsActive(false);
            return serviceRepository.save(service);
        }).orElseThrow(() -> new RuntimeException("服務項目不存在，ID：" + id));
    }
}
