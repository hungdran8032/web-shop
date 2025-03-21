package com.dran.webshop.mapper;

import org.springframework.stereotype.Service;

import com.dran.webshop.model.Category;
import com.dran.webshop.model.Product;
import com.dran.webshop.request.CreateProductRequest;
import com.dran.webshop.request.UpdateProductRequest;
import com.dran.webshop.response.ProductResponse;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ProductMapper {
    private final CategoryMapper categoryMapper;

    public Product convertToEntity(CreateProductRequest req, Category category) {
        return Product.builder()
                .name(req.getName())
                .description(req.getDescription())
                .price(req.getPrice())
                .quantity(req.getQuantity())
                .category(category)
                .build();
    }

    public Product convertToEntity(UpdateProductRequest req, Category category) {
        return Product.builder()
                .name(req.getName())
                .description(req.getDescription())
                .price(req.getPrice())
                .quantity(req.getQuantity())
                .category(category)
                .build();
    }

    public ProductResponse convertToResponse(Product product) {
        return ProductResponse.builder()
                .id(product.getId())
                .name(product.getName())
                .description(product.getDescription())
                .price(product.getPrice())
                .quantity(product.getQuantity())
                .imageUrl(product.getImageUrl())
                .category(
                        product.getCategory() != null ? categoryMapper.convertToResponse(product.getCategory()) : null)
                .build();
    }
}
