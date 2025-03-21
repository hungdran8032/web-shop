package com.dran.webshop.service;

import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import com.dran.webshop.request.CreateProductRequest;
import com.dran.webshop.request.UpdateProductRequest;
import com.dran.webshop.response.ProductResponse;

public interface ProductService {
    ProductResponse createProduct(CreateProductRequest req, MultipartFile file);

    ProductResponse updateProduct(Long id, UpdateProductRequest req, MultipartFile file);

    void deleteProduct(Long id);

    ProductResponse getProduct(Long id);

    List<ProductResponse> getAllProducts();
}
