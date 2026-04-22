package com.mushue.repository;

import com.mushue.entity.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, Integer> {

    // 用電話查詢客戶
    Customer findByPhone(String phone);

    // 用姓名查詢客戶（模糊搜尋）
    List<Customer> findByNameContaining(String name);
}
