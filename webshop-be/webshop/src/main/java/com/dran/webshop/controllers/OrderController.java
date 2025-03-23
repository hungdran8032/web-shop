package com.dran.webshop.controllers;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
// import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;

import com.dran.webshop.config.JwtProvider;
import com.dran.webshop.request.OrderRequest;
import com.dran.webshop.request.UpdateStatusRequest;
import com.dran.webshop.response.OrderResponse;
import com.dran.webshop.service.OrderService;
import com.dran.webshop.util.JsonUtils;
import com.dran.webshop.util.TypeToken;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/orders")
@RequiredArgsConstructor
public class OrderController {
    private final OrderService orderService;
    private final JwtProvider jwtProvider;

    @PostMapping
    @PreAuthorize("hasRole('ROLE_USER') or hasRole('ROLE_ADMIN')")
    public ResponseEntity<OrderResponse> createOrder(@RequestPart("order") String json,
            @RequestHeader("Authorization") String jwt) {

        OrderRequest req = JsonUtils.parseJson(json, OrderRequest.class);
        OrderResponse res = orderService.createOrder(req, jwt);
        return ResponseEntity.ok(res);
    }

    @PostMapping("/{orderId}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<OrderResponse> updateOrderStatus(
            @RequestPart("status") String json,
            @PathVariable Long orderId,
            @RequestHeader("Authorization") String jwt) {
        Long userId = jwtProvider.getUserIdFromToken(jwt, TypeToken.ACCESS);
        if (userId == null) {
            throw new IllegalArgumentException("Invalid or expired JWT token");
        }
        UpdateStatusRequest req = JsonUtils.parseJson(json, UpdateStatusRequest.class);
        OrderResponse res = orderService.updateOrderStatus(orderId, req);
        return ResponseEntity.ok(res);
    }

    @GetMapping("/{orderId}")
    public ResponseEntity<OrderResponse> getOrderById(
            @PathVariable Long orderId,
            @RequestHeader("Authorization") String jwt) {
        Long userId = jwtProvider.getUserIdFromToken(jwt, TypeToken.ACCESS);
        OrderResponse response = orderService.getOrderByIdForUser(orderId, userId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/admin/{orderId}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<OrderResponse> getOrderByIdForAdmin(
            @PathVariable Long orderId) {
        OrderResponse response = orderService.getOrderById(orderId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/user/{userId}")
    @PreAuthorize("hasRole('ROLE_USER') or hasRole('ROLE_ADMIN')")
    public ResponseEntity<List<OrderResponse>> getOrdersByUser(
            @PathVariable Long userId) {
        List<OrderResponse> res = orderService.getOrdersByUser(userId);
        return ResponseEntity.ok(res);
    }

    @GetMapping("/admin")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<List<OrderResponse>> getOrders() {
        List<OrderResponse> res = orderService.getOrders();
        return ResponseEntity.ok(res);
    }

}
