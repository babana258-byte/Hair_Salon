package com.mushue.repository;

import com.mushue.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Integer> {

    // 用類型查詢產品
    List<Product> findByType(Product.Type type);

    // 用品牌查詢產品
    List<Product> findByBrand(String brand);

    // 用名稱模糊搜尋
    List<Product> findByNameContaining(String name);
}
