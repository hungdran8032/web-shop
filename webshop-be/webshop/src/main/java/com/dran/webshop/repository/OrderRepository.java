package com.dran.webshop.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.dran.webshop.model.Order;

public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUserId(Long userId);
}
