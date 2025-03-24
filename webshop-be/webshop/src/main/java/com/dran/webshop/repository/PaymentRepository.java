package com.dran.webshop.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.dran.webshop.model.Order;
import com.dran.webshop.model.Payment;

public interface PaymentRepository extends JpaRepository<Payment, Long> {
    Payment findByOrder(Order orderId);
}
