package com.mushue.service;

import com.mushue.entity.Customer;
import com.mushue.repository.CustomerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class CustomerService {

    @Autowired
    private CustomerRepository customerRepository;

    // 取得所有客戶
    public List<Customer> getAllCustomers() {
        return customerRepository.findAll();
    }

    // 用ID取得客戶
    public Optional<Customer> getCustomerById(Integer id) {
        return customerRepository.findById(id);
    }

    // 用電話查詢客戶
    public Customer getCustomerByPhone(String phone) {
        return customerRepository.findByPhone(phone);
    }

    // 用姓名模糊搜尋
    public List<Customer> searchCustomersByName(String name) {
        return customerRepository.findByNameContaining(name);
    }

    // 新增客戶
    public Customer createCustomer(Customer customer) {
        return customerRepository.save(customer);
    }

    // 更新客戶
    public Customer updateCustomer(Integer id, Customer updatedCustomer) {
        return customerRepository.findById(id).map(customer -> {
            customer.setName(updatedCustomer.getName());
            customer.setPhone(updatedCustomer.getPhone());
            customer.setGender(updatedCustomer.getGender());
            customer.setBirthday(updatedCustomer.getBirthday());
            customer.setNotes(updatedCustomer.getNotes());
            return customerRepository.save(customer);
        }).orElseThrow(() -> new RuntimeException("客戶不存在，ID：" + id));
    }

    // 刪除客戶
    public void deleteCustomer(Integer id) {
        customerRepository.deleteById(id);
    }
}
