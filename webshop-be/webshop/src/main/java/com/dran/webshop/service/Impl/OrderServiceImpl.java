package com.dran.webshop.service.Impl;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.dran.webshop.config.JwtProvider;
import com.dran.webshop.exception.ProductException;
import com.dran.webshop.mapper.OrderDetailMapper;
import com.dran.webshop.mapper.OrderMapper;
import com.dran.webshop.model.CartItem;
import com.dran.webshop.model.Order;
import com.dran.webshop.model.OrderDetail;
import com.dran.webshop.model.Product;
import com.dran.webshop.repository.CartItemRepository;
import com.dran.webshop.model.User;
import com.dran.webshop.repository.OrderRepository;
import com.dran.webshop.repository.ProductRepository;
import com.dran.webshop.repository.UserRepository;
import com.dran.webshop.request.OrderRequest;
import com.dran.webshop.request.UpdateStatusRequest;
import com.dran.webshop.response.OrderDetailResponse;
import com.dran.webshop.response.OrderResponse;
import com.dran.webshop.service.OrderService;
import com.dran.webshop.util.TypeToken;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final OrderDetailMapper orderDetailMapper;
    private final UserRepository userRepository;
    private final JwtProvider jwtProvider;
    private final OrderRepository orderRepository;
    private final OrderMapper orderMapper;

    @Override
    public OrderResponse createOrder(OrderRequest req, String jwt) {
        Long userId;
        try {
            userId = jwtProvider.getUserIdFromToken(jwt, TypeToken.ACCESS);
        } catch (Exception e) {
            throw new IllegalArgumentException("Invalid or expired JWT token: " + e.getMessage());
        }
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        List<CartItem> cartItems = cartItemRepository.findByUserId(userId);
        if (cartItems.isEmpty()) {
            throw new RuntimeException("Vui lòng thêm sản phẩm vào giỏ hàng ");
        }
        Order order = orderMapper.convertToEntity(req);

        List<OrderDetail> orderDetails = new ArrayList<>();
        double totalPrice = 0;
        // Xử lý từng cart item
        for (CartItem cartItem : cartItems) {
            Product product = cartItem.getProduct();

            // Kiểm tra số lượng tồn kho
            if (product.getQuantity() < cartItem.getQuantity()) {
                throw new ProductException("Insufficient stock for product: " + product.getName());
            }

            // Tạo order detail
            OrderDetail orderDetail = orderDetailMapper.convertToEntity(order, cartItem, product);

            orderDetails.add(orderDetail);

            // Cộng dồn vào totalPrice
            totalPrice += orderDetail.getPrice();

            // Cập nhật số lượng tồn kho của sản phẩm
            product.setQuantity(product.getQuantity() - cartItem.getQuantity());
            productRepository.save(product);
        }
        // Cập nhật order
        order.setUser(user);
        order.setOrderDetails(orderDetails);
        order.setTotalPrice(totalPrice);
        Order savedOrder = orderRepository.save(order);
        cartItemRepository.deleteAll(cartItems);
        OrderResponse orderResponse = orderMapper.convertToResponse(savedOrder);
        List<OrderDetailResponse> orderDetailResponses = savedOrder.getOrderDetails().stream()
                .map(orderDetailMapper::convertToResponse)
                .collect(Collectors.toList());
        orderResponse.setOrderDetails(orderDetailResponses);

        return orderResponse;
    }

    @Override
    public List<OrderResponse> getOrdersByUser(Long userId) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'getOrdersByUser'");
    }

    @Override
    public OrderResponse getOrderById(Long orderId) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'getOrderById'");
    }

    @Override
    public void updateOrderStatus(Long orderId, UpdateStatusRequest req) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'updateOrderStatus'");
    }

    @Override
    public List<OrderResponse> getOrders() {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'getOrders'");
    }

}
