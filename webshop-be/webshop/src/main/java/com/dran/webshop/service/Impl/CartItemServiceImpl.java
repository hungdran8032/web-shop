package com.dran.webshop.service.Impl;

import com.dran.webshop.mapper.CartItemMapper;
import com.dran.webshop.model.CartItem;
import com.dran.webshop.model.Product;
import com.dran.webshop.model.User;
import com.dran.webshop.repository.CartItemRepository;
import com.dran.webshop.repository.ProductRepository;
import com.dran.webshop.repository.UserRepository;
import com.dran.webshop.request.CartItemRequest;
import com.dran.webshop.response.CartItemResponse;
import com.dran.webshop.service.CartItemService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CartItemServiceImpl implements CartItemService {
    private final CartItemRepository cartItemRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final CartItemMapper cartItemMapper;

    @Override
    public CartItemResponse createCartItem(CartItemRequest req) {
        // Kiểm tra user có tồn tại không
        User user = userRepository.findById(req.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found with id: " + req.getUserId()));

        // Kiểm tra product có tồn tại không
        Product product = productRepository.findById(req.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + req.getProductId()));

        // Kiểm tra xem sản phẩm đã có trong giỏ hàng của user chưa
        Optional<CartItem> existingCartItem = cartItemRepository.findByUserIdAndProductId(req.getUserId(),
                req.getProductId());
        if (existingCartItem.isPresent()) {
            // Nếu đã có, cập nhật số lượng
            CartItem cartItem = existingCartItem.get();
            cartItem.setQuantity(cartItem.getQuantity() + req.getQuantity());
            cartItem.setPrice(product.getPrice() * cartItem.getQuantity());
            cartItemRepository.save(cartItem);
            return cartItemMapper.toCartItemResponse(cartItem);
        }

        // Nếu chưa có, tạo mới CartItem
        CartItem cartItem = CartItem.builder()
                .user(user)
                .product(product)
                .quantity(req.getQuantity())
                .price(product.getPrice() * req.getQuantity())
                .build();

        cartItemRepository.save(cartItem);
        return cartItemMapper.toCartItemResponse(cartItem);
    }

    @Override
    public CartItemResponse updateQuantity(Long id, Integer quantity) {
        // Tìm CartItem theo id
        CartItem cartItem = cartItemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("CartItem not found with id: " + id));

        // Kiểm tra số lượng hợp lệ
        if (quantity <= 0) {
            throw new RuntimeException("Quantity must be greater than 0");
        }

        // Cập nhật số lượng và giá
        cartItem.setQuantity(quantity);
        cartItem.setPrice(cartItem.getProduct().getPrice() * quantity);
        cartItemRepository.save(cartItem);

        return cartItemMapper.toCartItemResponse(cartItem);
    }

    @Override
    public List<CartItemResponse> getCartItemsByUser(Long userId) {
        // Kiểm tra user có tồn tại không
        userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        // Lấy danh sách CartItem của user
        List<CartItem> cartItems = cartItemRepository.findByUserId(userId);
        return cartItems.stream()
                .map(cartItemMapper::toCartItemResponse)
                .toList();
    }

    @Override
    public void deleteCartItem(Long id) {
        // Kiểm tra CartItem có tồn tại không
        CartItem cartItem = cartItemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("CartItem not found with id: " + id));

        cartItemRepository.delete(cartItem);
    }
}