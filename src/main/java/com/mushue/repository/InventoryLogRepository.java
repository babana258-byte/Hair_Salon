package com.mushue.repository;

import com.mushue.entity.InventoryLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface InventoryLogRepository extends JpaRepository<InventoryLog, Integer> {

    // 查詢某個產品的所有異動記錄
    List<InventoryLog> findByProductId(Integer productId);

    // 查詢某種異動類型的記錄
    List<InventoryLog> findByChangeType(InventoryLog.ChangeType changeType);
}
