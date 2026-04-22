package com.mushue.repository;

import com.mushue.entity.InvoiceItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface InvoiceItemRepository extends JpaRepository<InvoiceItem, Integer> {

    // 查詢某張消費單的所有明細
    List<InvoiceItem> findByInvoiceId(Integer invoiceId);
}
