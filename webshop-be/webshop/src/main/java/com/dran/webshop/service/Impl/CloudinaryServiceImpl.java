package com.dran.webshop.service.Impl;

import java.io.IOException;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.dran.webshop.service.CloudinaryService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CloudinaryServiceImpl implements CloudinaryService {
    private final Cloudinary cloudinary;

    @Override
    public String uploadFile(MultipartFile file) {
        try {
            // Upload file lên Cloudinary
            Map uploadResult = cloudinary.uploader().upload(file.getBytes(),
                    ObjectUtils.asMap("resource_type", "auto"));

            // Trả về URL của tệp đã tải lên
            return uploadResult.get("secure_url").toString();
        } catch (IOException e) {
            throw new RuntimeException("Lỗi khi tải lên tệp: " + e.getMessage(), e);
        }
    }

    @Override
    public String deleteFile(String publicId) {
        try {
            // Xóa tệp trên Cloudinary
            cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());

            // Trả về thông báo xóa thành công
            return "Xóa tệp thành công";
        } catch (IOException e) {
            throw new RuntimeException("Lỗi khi xóa tệp: " + e.getMessage(), e);
        }
    }

    @Override
    public String updateFile(MultipartFile file) {
        return null;
    }

}
