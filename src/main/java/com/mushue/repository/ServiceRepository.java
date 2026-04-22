package com.mushue.repository;

import com.mushue.entity.Service;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ServiceRepository extends JpaRepository<Service, Integer> {

    // 查詢上架中的服務
    List<Service> findByIsActiveTrue();

    // 用類別查詢服務
    List<Service> findByCategory(Service.Category category);
}
