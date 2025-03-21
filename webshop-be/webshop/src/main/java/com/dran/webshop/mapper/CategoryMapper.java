package com.dran.webshop.mapper;

import org.springframework.stereotype.Service;

import com.dran.webshop.model.Category;
import com.dran.webshop.request.CategoryRequest;
import com.dran.webshop.response.CategoryResponse;

@Service
public class CategoryMapper {
    public Category convertToEntity(CategoryRequest req) {
        return Category.builder()
                .name(req.getName())
                .build();
    }

    public CategoryResponse convertToResponse(Category category) {
        return CategoryResponse.builder()
                .id(category.getId())
                .name(category.getName())
                .build();
    }
}
