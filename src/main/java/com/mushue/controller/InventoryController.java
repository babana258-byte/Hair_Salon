package com.mushue.controller;

import com.mushue.entity.Inventory;
import com.mushue.entity.InventoryLog;
import com.mushue.service.InventoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/inventory")
@CrossOrigin(origins = "*")
public class InventoryController {

    @Autowired
    private InventoryService inventoryService;

    // 取得所有庫存
    @GetMapping
    public List<Inventory> getAllInventory() {
        return inventoryService.getAllInventory();
    }

    // 用產品ID查詢庫存
    @GetMapping("/product/{productId}")
    public ResponseEntity<Inventory> getInventoryByProduct(@PathVariable Integer productId) {
        Inventory inventory = inventoryService.getInventoryByProductId(productId);
        return inventory != null ? ResponseEntity.ok(inventory)
                                 : ResponseEntity.notFound().build();
    }

    // 查詢低於安全庫存的產品
    @GetMapping("/low-stock")
    public List<Inventory> getLowStockInventory() {
        return inventoryService.getBelowSafetyStock();
    }

    // 新增庫存
    @PostMapping
    public Inventory createInventory(@RequestBody Inventory inventory) {
        return inventoryService.createInventory(inventory);
    }

    // 調整庫存數量
    @PutMapping("/adjust/{productId}")
    public ResponseEntity<Inventory> adjustQuantity(
            @PathVariable Integer productId,
            @RequestParam Integer quantityChange,
            @RequestParam InventoryLog.ChangeType changeType) {
        try {
            return ResponseEntity.ok(
                inventoryService.adjustQuantity(productId, quantityChange, changeType));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // 更新盤點日期
    @PutMapping("/check/{productId}")
    public ResponseEntity<Inventory> updateLastChecked(@PathVariable Integer productId) {
        try {
            return ResponseEntity.ok(inventoryService.updateLastChecked(productId));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
