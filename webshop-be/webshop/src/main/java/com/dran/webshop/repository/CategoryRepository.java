package com.dran.webshop.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.dran.webshop.model.Category;

public interface CategoryRepository extends JpaRepository<Category, Long> {

}
