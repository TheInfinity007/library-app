package com.love2code.library_app_service.controller;

import com.love2code.library_app_service.requestmodels.PaymentInfoRequest;
import com.love2code.library_app_service.service.PaymentService;
import com.love2code.library_app_service.utils.ExtractJWT;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    private final PaymentService paymentService;

    @Autowired
    PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @PostMapping("/secure/payment-intent")
    public ResponseEntity<String> createPaymentIntent(@RequestBody PaymentInfoRequest paymentInfoRequest) throws StripeException {
        PaymentIntent paymentIntent = paymentService.createPaymentIntent(paymentInfoRequest);

        String responseBody = paymentIntent.toJson();
        return new ResponseEntity<>(responseBody, HttpStatus.OK);
    }

    @PutMapping("/secure/payment-complete")
    public ResponseEntity<String> stripePaymentComplete(@RequestHeader(name = "Authorization") String token) throws Exception {
        String userEmail = ExtractJWT.payloadJWTExtraction(token, "sub");

        if (userEmail == null) {
            throw new Exception("User email is missing");
        }

        paymentService.stripePayment(userEmail);

        return new ResponseEntity<>(HttpStatus.OK);
    }

}
