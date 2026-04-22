package com.mushue.repository;

import com.mushue.entity.PurchaseOrder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface PurchaseOrderRepository extends JpaRepository<PurchaseOrder, Integer> {

    // 查詢某個產品的所有進貨記錄
    List<PurchaseOrder> findByProductId(Integer productId);

    // 查詢某段時間內的進貨記錄
    List<PurchaseOrder> findByOrderedAtBetween(LocalDate start, LocalDate end);

    // 查詢某個廠商的進貨記錄
    List<PurchaseOrder> findBySupplier(String supplier);
}
