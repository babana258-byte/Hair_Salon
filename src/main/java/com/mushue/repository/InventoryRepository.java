package com.mushue.repository;

import com.mushue.entity.Inventory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface InventoryRepository extends JpaRepository<Inventory, Integer> {

    // 用產品ID查詢庫存
    Inventory findByProductId(Integer productId);

    // 查詢低於安全庫存的產品
    @Query("SELECT i FROM Inventory i WHERE i.quantity <= i.safetyStock")
    List<Inventory> findBelowSafetyStock();
}
