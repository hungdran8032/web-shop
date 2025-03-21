package com.dran.webshop.controllers;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.dran.webshop.request.CreateProductRequest;
import com.dran.webshop.request.UpdateProductRequest;
import com.dran.webshop.response.ProductResponse;
import com.dran.webshop.service.ProductService;
import com.dran.webshop.util.JsonUtils;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/products")
@RequiredArgsConstructor
public class ProductController {
    private final ProductService productService;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<ProductResponse> createProduct(
            @RequestPart("file") MultipartFile file,
            @RequestPart("product") String product) {
        CreateProductRequest req = JsonUtils.parseJson(product, CreateProductRequest.class);
        ProductResponse productResponse = productService.createProduct(req, file);
        return ResponseEntity.ok(productResponse);
    }

    @GetMapping
    public ResponseEntity<List<ProductResponse>> getList() {
        List<ProductResponse> res = productService.getAllProducts();
        return ResponseEntity.ok(res);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductResponse> getProductById(@PathVariable Long id) {
        ProductResponse res = productService.getProduct(id);
        return ResponseEntity.ok(res);
    }

    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<ProductResponse> updateProduct(
            @PathVariable Long id,
            @RequestPart(name = "file", required = false) MultipartFile file,
            @RequestPart(name = "product", required = false) String product) {
        UpdateProductRequest req = JsonUtils.parseJson(product, UpdateProductRequest.class);
        ProductResponse productResponse = productService.updateProduct(id, req, file);
        return ResponseEntity.ok(productResponse);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.noContent().build();
    }
}
