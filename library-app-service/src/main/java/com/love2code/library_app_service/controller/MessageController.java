package com.love2code.library_app_service.controller;

import com.love2code.library_app_service.entity.Message;
import com.love2code.library_app_service.requestmodels.AdminQuestionRequest;
import com.love2code.library_app_service.service.MessageService;
import com.love2code.library_app_service.utils.ExtractJWT;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/messages")
public class MessageController {
    private MessageService messageService;

    @Autowired
    MessageController(MessageService messageService) {
        this.messageService = messageService;
    }

    @PostMapping("/secure")
    public Message createMessage(@RequestHeader(name = "Authorization") String token,
                                 @RequestBody Message messageRequest) {
        String userEmail = ExtractJWT.payloadJWTExtraction(token, "sub");
        return messageService.createMessage(messageRequest, userEmail);
    }

    @PutMapping("/secure")
    public void updateMessage(@RequestHeader(name = "Authorization") String token,
                              @RequestBody AdminQuestionRequest adminQuestionRequest) throws Exception {
        String userEmail = ExtractJWT.payloadJWTExtraction(token, "sub");
        String userType = ExtractJWT.payloadJWTExtraction(token, "userType");

        if (!userType.equals("ADMIN")) {
            throw new Exception("You are not allowed. Admin only!");
        }

        messageService.updateMessage(adminQuestionRequest, userEmail);
    }
}
