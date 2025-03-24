package com.dran.webshop.config;

import org.springframework.context.annotation.Configuration;

@Configuration
public class VNPayConfig {
    public static final String VNP_PAY_URL = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
    public static final String VNP_RETURN_URL = "http://localhost:8080/payment/vnpay/return";
    public static final String VNP_TMN_CODE = "";
    public static final String VNP_HASH_SECRET = "";
    public static final String VNP_VERSION = "2.1.0";
    public static final String VNP_COMMAND = "pay";
    public static final String VNP_CURR_CODE = "VND";
}
