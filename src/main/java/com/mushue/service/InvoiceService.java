package com.mushue.service;

import com.mushue.entity.Invoice;
import com.mushue.repository.InvoiceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class InvoiceService {

    @Autowired
    private InvoiceRepository invoiceRepository;

    // 取得所有消費單
    public List<Invoice> getAllInvoices() {
        return invoiceRepository.findAll();
    }

    // 用ID取得消費單
    public Optional<Invoice> getInvoiceById(Integer id) {
        return invoiceRepository.findById(id);
    }

    // 取得某位客戶的所有消費單
    public List<Invoice> getInvoicesByCustomerId(Integer customerId) {
        return invoiceRepository.findByCustomerId(customerId);
    }

    // 取得某段時間內的消費單
    public List<Invoice> getInvoicesBetween(LocalDateTime start, LocalDateTime end) {
        return invoiceRepository.findByInvoiceDateBetween(start, end);
    }

    // 取得尚未付款的消費單
    public List<Invoice> getUnpaidInvoices() {
        return invoiceRepository.findByPaidAtIsNull();
    }

    // 新增消費單
    public Invoice createInvoice(Invoice invoice) {
        return invoiceRepository.save(invoice);
    }

    // 確認付款
    public Invoice confirmPayment(Integer id) {
        return invoiceRepository.findById(id).map(invoice -> {
            invoice.setPaidAt(LocalDateTime.now());
            return invoiceRepository.save(invoice);
        }).orElseThrow(() -> new RuntimeException("消費單不存在，ID：" + id));
    }

    // 更新消費單
    public Invoice updateInvoice(Integer id, Invoice updatedInvoice) {
        return invoiceRepository.findById(id).map(invoice -> {
            invoice.setSubtotal(updatedInvoice.getSubtotal());
            invoice.setDiscount(updatedInvoice.getDiscount());
            invoice.setTotal(updatedInvoice.getTotal());
            invoice.setPaymentMethod(updatedInvoice.getPaymentMethod());
            return invoiceRepository.save(invoice);
        }).orElseThrow(() -> new RuntimeException("消費單不存在，ID：" + id));
    }
}
