package com.mushue.repository;

import com.mushue.entity.Invoice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface InvoiceRepository extends JpaRepository<Invoice, Integer> {

    // 查詢某位客戶的所有消費單
    List<Invoice> findByCustomerId(Integer customerId);

    // 查詢某筆預約的消費單
    Invoice findByAppointmentId(Integer appointmentId);

    // 查詢某段時間內的消費單
    List<Invoice> findByInvoiceDateBetween(LocalDateTime start, LocalDateTime end);

    // 查詢尚未付款的消費單
    List<Invoice> findByPaidAtIsNull();
}
