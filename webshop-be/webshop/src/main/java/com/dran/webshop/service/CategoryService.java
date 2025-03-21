package com.dran.webshop.service;

import java.util.List;

import com.dran.webshop.request.CategoryRequest;
import com.dran.webshop.response.CategoryResponse;

public interface CategoryService {
    CategoryResponse create(CategoryRequest req);

    CategoryResponse update(Long id, CategoryRequest req);

    void delete(Long id);

    CategoryResponse findById(Long id);

    List<CategoryResponse> findAll();

}
