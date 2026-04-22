package com.mushue.repository;

import com.mushue.entity.Staff;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface StaffRepository extends JpaRepository<Staff, Integer> {

    // 查詢在職員工
    List<Staff> findByIsActiveTrue();

    // 用姓名查詢員工
    Staff findByName(String name);
}
