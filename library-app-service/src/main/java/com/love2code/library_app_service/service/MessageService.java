package com.love2code.library_app_service.service;

import com.love2code.library_app_service.dao.MessageRepository;
import com.love2code.library_app_service.entity.Message;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class MessageService {
    private final MessageRepository messageRepository;

    @Autowired
    MessageService(MessageRepository messageRepository) {
        this.messageRepository = messageRepository;
    }

    public Message postMessage(Message messageRequest, String userEmail) {
        Message message = new Message(messageRequest.getTitle(), messageRequest.getQuestion(), false);

        message.setUserEmail(userEmail);
        return messageRepository.save(message);
    }
}
