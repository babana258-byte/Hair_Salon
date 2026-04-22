package com.mushue.service;

import com.mushue.entity.Inventory;
import com.mushue.entity.InventoryLog;
import com.mushue.repository.InventoryRepository;
import com.mushue.repository.InventoryLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.List;

@Service
public class InventoryService {

    @Autowired
    private InventoryRepository inventoryRepository;

    @Autowired
    private InventoryLogRepository inventoryLogRepository;

    // 取得所有庫存
    public List<Inventory> getAllInventory() {
        return inventoryRepository.findAll();
    }

    // 用產品ID查詢庫存
    public Inventory getInventoryByProductId(Integer productId) {
        return inventoryRepository.findByProductId(productId);
    }

    // 查詢低於安全庫存的產品
    public List<Inventory> getBelowSafetyStock() {
        return inventoryRepository.findBelowSafetyStock();
    }

    // 新增庫存
    public Inventory createInventory(Inventory inventory) {
        return inventoryRepository.save(inventory);
    }

    // 調整庫存數量並記錄異動
    public Inventory adjustQuantity(Integer productId, Integer quantityChange,
                                    InventoryLog.ChangeType changeType) {
        Inventory inventory = inventoryRepository.findByProductId(productId);
        if (inventory == null) {
            throw new RuntimeException("庫存不存在，產品ID：" + productId);
        }

        inventory.setQuantity(inventory.getQuantity() + quantityChange);
        inventoryRepository.save(inventory);

        // 記錄庫存異動
        InventoryLog log = new InventoryLog();
        log.setProduct(inventory.getProduct());
        log.setChangeType(changeType);
        log.setQuantityChange(quantityChange);
        inventoryLogRepository.save(log);

        return inventory;
    }

    // 盤點更新
    public Inventory updateLastChecked(Integer productId) {
        Inventory inventory = inventoryRepository.findByProductId(productId);
        if (inventory == null) {
            throw new RuntimeException("庫存不存在，產品ID：" + productId);
        }
        inventory.setLastCheckedAt(LocalDate.now());
        return inventoryRepository.save(inventory);
    }
}
