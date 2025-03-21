package com.dran.webshop.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;

import java.time.LocalDateTime;

@RestControllerAdvice
public class GlobalException {
    @ExceptionHandler(UserException.class)
    public ResponseEntity<ErrorDetail> userExceptionHandler(UserException se, WebRequest req) {
        ErrorDetail errorDetail = new ErrorDetail();
        errorDetail.setError(se.getMessage());
        errorDetail.setDetails(req.getDescription(false));
        errorDetail.setTimestamp(LocalDateTime.now());
        return new ResponseEntity<>(errorDetail, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(ProductException.class)
    public ResponseEntity<ErrorDetail> productExceptionHandler(ProductException pe, WebRequest req) {
        ErrorDetail errorDetail = new ErrorDetail();
        errorDetail.setError(pe.getMessage());
        errorDetail.setDetails(req.getDescription(false));
        errorDetail.setTimestamp(LocalDateTime.now());
        return new ResponseEntity<>(errorDetail, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(CategoryException.class)
    public ResponseEntity<ErrorDetail> categoryExceptionHandler(CategoryException ce, WebRequest req) {
        ErrorDetail errorDetail = new ErrorDetail();
        errorDetail.setError(ce.getMessage());
        errorDetail.setDetails(req.getDescription(false));
        errorDetail.setTimestamp(LocalDateTime.now());
        return new ResponseEntity<>(errorDetail, HttpStatus.BAD_REQUEST);
    }

}
