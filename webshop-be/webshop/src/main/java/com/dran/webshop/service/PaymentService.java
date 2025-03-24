package com.dran.webshop.service;

import java.util.Map;

import com.dran.webshop.model.Order;

public interface PaymentService {
    String createVNPayPaymentUrl(Order order, String clientIp) throws Exception;

    void handleVNPayReturn(Map<String, String> params);
}
