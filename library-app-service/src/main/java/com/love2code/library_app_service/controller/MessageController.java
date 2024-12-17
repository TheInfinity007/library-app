package com.love2code.library_app_service.controller;

import com.love2code.library_app_service.entity.Message;
import com.love2code.library_app_service.service.MessageService;
import com.love2code.library_app_service.utils.ExtractJWT;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@CrossOrigin("http://localhost:3000")
@RestController
@RequestMapping("/api/messages")
public class MessageController {
    private MessageService messageService;

    @Autowired
    MessageController(MessageService messageService) {
        this.messageService = messageService;
    }

    @PostMapping("/secure")
    public Message postMessage(@RequestHeader(name = "Authorization") String token,
                               @RequestBody Message messageRequest) {
        String userEmail = ExtractJWT.payloadJWTExtraction(token, "sub");
        return messageService.postMessage(messageRequest, userEmail);
    }
}
