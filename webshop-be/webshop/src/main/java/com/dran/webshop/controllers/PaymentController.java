package com.dran.webshop.controllers;

import com.dran.webshop.model.Order;
import com.dran.webshop.repository.OrderRepository;
import com.dran.webshop.service.PaymentService;

import jakarta.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/payment/vnpay")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    @Autowired
    private OrderRepository orderRepository;

    @GetMapping("/create")
    public ResponseEntity<String> createPayment(@RequestParam Long orderId, HttpServletRequest request)
            throws Exception {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        String clientIp = request.getRemoteAddr();
        String paymentUrl = paymentService.createVNPayPaymentUrl(order, clientIp);
        return ResponseEntity.ok(paymentUrl);
    }

    @GetMapping("/return")
    public ResponseEntity<String> handleReturn(@RequestParam Map<String, String> params) {
        try {
            paymentService.handleVNPayReturn(params);
            return ResponseEntity.ok("Thanh toán thành công!");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Thanh toán thất bại: " + e.getMessage());
        }
    }
}
