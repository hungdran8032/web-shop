// package com.dran.webshop.controllers;

// import org.springframework.http.ResponseEntity;
// import org.springframework.security.access.prepost.PreAuthorize;
// import org.springframework.web.bind.annotation.GetMapping;
// import org.springframework.web.bind.annotation.PathVariable;
// import org.springframework.web.bind.annotation.RequestMapping;
// import org.springframework.web.bind.annotation.RestController;

// import com.dran.webshop.response.OrderResponse;
// import com.dran.webshop.service.OrderService;

// import lombok.RequiredArgsConstructor;

// @RestController
// @RequestMapping("/api/v1/admin")
// @RequiredArgsConstructor
// public class AdminController {
// private final OrderService orderService;

// @GetMapping("/orders/{orderId}")
// @PreAuthorize("hasRole('ROLE_ADMIN')")
// public ResponseEntity<OrderResponse> getOrderByIdForAdmin(@PathVariable Long
// orderId) {
// OrderResponse response = orderService.getOrderById(orderId);
// return ResponseEntity.ok(response);
// }
// }
