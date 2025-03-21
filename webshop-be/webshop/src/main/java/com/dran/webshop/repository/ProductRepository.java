package com.dran.webshop.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.dran.webshop.model.Product;

public interface ProductRepository extends JpaRepository<Product, Long> {

}
