package com.mushue.service;

import com.mushue.entity.Product;
import com.mushue.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    // 取得所有產品
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    // 用ID取得產品
    public Optional<Product> getProductById(Integer id) {
        return productRepository.findById(id);
    }

    // 用類型查詢產品
    public List<Product> getProductsByType(Product.Type type) {
        return productRepository.findByType(type);
    }

    // 用名稱模糊搜尋
    public List<Product> searchProductsByName(String name) {
        return productRepository.findByNameContaining(name);
    }

    // 新增產品
    public Product createProduct(Product product) {
        return productRepository.save(product);
    }

    // 更新產品
    public Product updateProduct(Integer id, Product updatedProduct) {
        return productRepository.findById(id).map(product -> {
            product.setBrand(updatedProduct.getBrand());
            product.setName(updatedProduct.getName());
            product.setType(updatedProduct.getType());
            product.setCost(updatedProduct.getCost());
            product.setPrice(updatedProduct.getPrice());
            return productRepository.save(product);
        }).orElseThrow(() -> new RuntimeException("產品不存在，ID：" + id));
    }

    // 刪除產品
    public void deleteProduct(Integer id) {
        productRepository.deleteById(id);
    }
}
