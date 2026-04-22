package com.mushue.repository;

import com.mushue.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {

    // 用帳號查詢使用者（登入用）
    User findByUsername(String username);

    // 確認帳號是否存在
    boolean existsByUsername(String username);
}
