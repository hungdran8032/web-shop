package com.dran.webshop.controllers;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;

import com.dran.webshop.request.CategoryRequest;
import com.dran.webshop.response.CategoryResponse;
import com.dran.webshop.service.CategoryService;
import com.dran.webshop.util.JsonUtils;

import lombok.RequiredArgsConstructor;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;

@RestController
@RequestMapping("/api/v1/categories")
@RequiredArgsConstructor
public class CategoryController {
    private final CategoryService categoryService;

    @GetMapping
    public ResponseEntity<List<CategoryResponse>> getList() {
        List<CategoryResponse> res = categoryService.findAll();
        return ResponseEntity.ok(res);
    }

    @PostMapping
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<CategoryResponse> create(@RequestPart("category") String category) {
        CategoryRequest req = JsonUtils.parseJson(category, CategoryRequest.class);
        CategoryResponse res = categoryService.create(req);
        return ResponseEntity.ok(res);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CategoryResponse> getCategoryById(@PathVariable Long id) {
        CategoryResponse res = categoryService.findById(id);
        return ResponseEntity.ok(res);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<CategoryResponse> update(@PathVariable Long id, @RequestPart("category") String category) {
        CategoryRequest req = JsonUtils.parseJson(category, CategoryRequest.class);
        CategoryResponse res = categoryService.update(id, req);
        return ResponseEntity.ok(res);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        categoryService.delete(id);
        return ResponseEntity.ok().build();
    }

}
