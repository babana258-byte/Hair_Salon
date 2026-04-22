package com.mushue.controller;

import com.mushue.entity.Invoice;
import com.mushue.service.InvoiceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/invoices")
@CrossOrigin(origins = "*")
public class InvoiceController {

    @Autowired
    private InvoiceService invoiceService;

    // 取得所有消費單
    @GetMapping
    public List<Invoice> getAllInvoices() {
        return invoiceService.getAllInvoices();
    }

    // 用ID取得消費單
    @GetMapping("/{id}")
    public ResponseEntity<Invoice> getInvoiceById(@PathVariable Integer id) {
        return invoiceService.getInvoiceById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // 取得某位客戶的消費單
    @GetMapping("/customer/{customerId}")
    public List<Invoice> getInvoicesByCustomer(@PathVariable Integer customerId) {
        return invoiceService.getInvoicesByCustomerId(customerId);
    }

    // 取得某段時間內的消費單
    @GetMapping("/between")
    public List<Invoice> getInvoicesBetween(@RequestParam LocalDateTime start,
                                             @RequestParam LocalDateTime end) {
        return invoiceService.getInvoicesBetween(start, end);
    }

    // 取得尚未付款的消費單
    @GetMapping("/unpaid")
    public List<Invoice> getUnpaidInvoices() {
        return invoiceService.getUnpaidInvoices();
    }

    // 新增消費單
    @PostMapping
    public Invoice createInvoice(@RequestBody Invoice invoice) {
        return invoiceService.createInvoice(invoice);
    }

    // 確認付款
    @PutMapping("/{id}/pay")
    public ResponseEntity<Invoice> confirmPayment(@PathVariable Integer id) {
        try {
            return ResponseEntity.ok(invoiceService.confirmPayment(id));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // 更新消費單
    @PutMapping("/{id}")
    public ResponseEntity<Invoice> updateInvoice(@PathVariable Integer id,
                                                  @RequestBody Invoice invoice) {
        try {
            return ResponseEntity.ok(invoiceService.updateInvoice(id, invoice));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
