package com.dran.webshop.service.Impl;

import java.util.List;

import org.springframework.stereotype.Service;

import com.dran.webshop.mapper.CategoryMapper;
import com.dran.webshop.model.Category;
import com.dran.webshop.repository.CategoryRepository;
import com.dran.webshop.request.CategoryRequest;
import com.dran.webshop.response.CategoryResponse;
import com.dran.webshop.service.CategoryService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService {
    private final CategoryRepository categoryRepository;
    private final CategoryMapper categoryMapper;

    @Override
    public CategoryResponse create(CategoryRequest req) {
        Category category = categoryMapper.convertToEntity(req);
        categoryRepository.save(category);
        return categoryMapper.convertToResponse(category);
    }

    @Override
    public CategoryResponse update(Long id, CategoryRequest req) {
        Category existingCategory = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found"));
        if (req.getName() != null) {
            existingCategory.setName(req.getName());
        }
        categoryRepository.save(existingCategory);
        return categoryMapper.convertToResponse(existingCategory);
    }

    @Override
    public void delete(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found"));
        categoryRepository.delete(category);
    }

    @Override
    public CategoryResponse findById(Long id) {
        CategoryResponse res = categoryRepository.findById(id)
                .map(categoryMapper::convertToResponse)
                .orElseThrow(() -> new RuntimeException("Category not found"));
        return res;

    }

    @Override
    public List<CategoryResponse> findAll() {
        List<CategoryResponse> res = categoryRepository.findAll()
                .stream()
                .map(categoryMapper::convertToResponse)
                .toList();
        return res;
    }

}
