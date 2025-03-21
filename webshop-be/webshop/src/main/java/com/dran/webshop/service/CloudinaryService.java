package com.dran.webshop.service;

import org.springframework.web.multipart.MultipartFile;

public interface CloudinaryService {
    String uploadFile(MultipartFile file);

    String deleteFile(String publicId);

    String updateFile(MultipartFile file);

    // String extractPublicId(String imageUrl);
}
