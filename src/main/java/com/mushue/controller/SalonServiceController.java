package com.mushue.controller;

import com.mushue.entity.Service;
import com.mushue.service.SalonServiceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/services")
@CrossOrigin(origins = "*")
public class SalonServiceController {

    @Autowired
    private SalonServiceService salonServiceService;

    // 取得所有服務項目
    @GetMapping
    public List<Service> getAllServices() {
        return salonServiceService.getAllServices();
    }

    // 用ID取得服務項目
    @GetMapping("/{id}")
    public ResponseEntity<Service> getServiceById(@PathVariable Integer id) {
        return salonServiceService.getServiceById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // 取得上架中的服務項目
    @GetMapping("/active")
    public List<Service> getActiveServices() {
        return salonServiceService.getActiveServices();
    }

    // 用類別查詢服務項目
    @GetMapping("/category/{category}")
    public List<Service> getServicesByCategory(@PathVariable Service.Category category) {
        return salonServiceService.getServicesByCategory(category);
    }

    // 新增服務項目
    @PostMapping
    public Service createService(@RequestBody Service service) {
        return salonServiceService.createService(service);
    }

    // 更新服務項目
    @PutMapping("/{id}")
    public ResponseEntity<Service> updateService(@PathVariable Integer id,
                                                  @RequestBody Service service) {
        try {
            return ResponseEntity.ok(salonServiceService.updateService(id, service));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // 下架服務項目
    @PutMapping("/{id}/deactivate")
    public ResponseEntity<Service> deactivateService(@PathVariable Integer id) {
        try {
            return ResponseEntity.ok(salonServiceService.deactivateService(id));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
