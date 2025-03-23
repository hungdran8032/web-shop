package com.dran.webshop.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.dran.webshop.model.OrderDetail;

public interface OrderDetailRepository extends JpaRepository<OrderDetail, Long> {

}
