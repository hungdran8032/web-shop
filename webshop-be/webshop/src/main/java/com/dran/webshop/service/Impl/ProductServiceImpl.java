package com.dran.webshop.service.Impl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.dran.webshop.exception.CategoryException;
import com.dran.webshop.exception.ProductException;
import com.dran.webshop.mapper.ProductMapper;
import com.dran.webshop.model.Category;
import com.dran.webshop.model.Product;
import com.dran.webshop.repository.CategoryRepository;
import com.dran.webshop.repository.ProductRepository;
import com.dran.webshop.request.CreateProductRequest;
import com.dran.webshop.request.UpdateProductRequest;
import com.dran.webshop.response.ProductResponse;
import com.dran.webshop.service.CloudinaryService;
import com.dran.webshop.service.ProductService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final CloudinaryService cloudinaryService;
    private final ProductMapper productMapper;

    @Override
    public ProductResponse createProduct(CreateProductRequest req, MultipartFile file) {
        Category category = categoryRepository.findById(req.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found with ID: " +
                        req.getCategoryId()));

        // // Use the mapper with the Category entity
        Product product = productMapper.convertToEntity(req, category);

        product.setImageUrl(cloudinaryService.uploadFile(file));
        productRepository.save(product);
        return productMapper.convertToResponse(product);
    }

    @Override
    public ProductResponse updateProduct(Long id, UpdateProductRequest req, MultipartFile file) {
        // Tìm product hiện tại từ database
        Product existingProduct = productRepository.findById(id)
                .orElseThrow(() -> new ProductException("Product not found"));
        if (req == null) {
            throw new IllegalArgumentException("Update request cannot be null");
        }
        // Cập nhật các trường nếu có giá trị mới

        if (req.getName() != null) {
            existingProduct.setName(req.getName());
        }
        if (req.getDescription() != null) {
            existingProduct.setDescription(req.getDescription());
        }
        if (req.getPrice() != null) {
            existingProduct.setPrice(req.getPrice());
        }
        if (req.getQuantity() != null) {
            existingProduct.setQuantity(req.getQuantity());
        }

        if (req.getCategoryId() != null) {
            Category category = categoryRepository.findById(req.getCategoryId())
                    .orElseThrow(
                            () -> new CategoryException("Category not found with ID: " + req.getCategoryId()));
            existingProduct.setCategory(category);
        }

        if (file != null && !file.isEmpty()) {
            String oldImage = existingProduct.getImageUrl();
            String publicId = extractPublicId(oldImage);
            cloudinaryService.deleteFile(publicId);
            String newImageUrl = cloudinaryService.uploadFile(file);
            existingProduct.setImageUrl(newImageUrl);
        }
        // Lưu và trả về response
        Product updatedProduct = productRepository.save(existingProduct);
        return productMapper.convertToResponse(updatedProduct);
    }

    @Override
    public void deleteProduct(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ProductException("Không tìm thấy sản phẩm này"));
        productRepository.delete(product);
        String imageUrl = product.getImageUrl();
        String publicId = extractPublicId(imageUrl);
        cloudinaryService.deleteFile(publicId);
        System.out.println("Product with ID " + product.getId() + " deleted from DB");
    }

    @Override
    public ProductResponse getProduct(Long id) {
        ProductResponse res = productRepository.findById(id).map(productMapper::convertToResponse)
                .orElseThrow(() -> new ProductException("Product not found"));
        return res;
    }

    @Override
    public List<ProductResponse> getAllProducts() {
        List<ProductResponse> res = productRepository.findAll().stream().map(productMapper::convertToResponse)
                .collect(Collectors.toList());
        return res;
    }

    public String extractPublicId(String imageUrl) {
        String[] parts = imageUrl.split("/");
        String fileName = parts[parts.length - 1];
        return fileName.substring(0, fileName.lastIndexOf("."));
    }

}
