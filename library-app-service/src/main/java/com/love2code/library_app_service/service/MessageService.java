package com.love2code.library_app_service.service;

import com.love2code.library_app_service.dao.MessageRepository;
import com.love2code.library_app_service.entity.Message;
import com.love2code.library_app_service.requestmodels.AdminQuestionRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@Transactional
public class MessageService {
    private final MessageRepository messageRepository;

    @Autowired
    MessageService(MessageRepository messageRepository) {
        this.messageRepository = messageRepository;
    }

    public Message createMessage(Message messageRequest, String userEmail) {
        Message message = new Message(messageRequest.getTitle(), messageRequest.getQuestion(), false);

        message.setUserEmail(userEmail);
        return messageRepository.save(message);
    }

    public void updateMessage(AdminQuestionRequest adminQuestionRequest, String userEmail) throws Exception {
        Optional<Message> messageOpt = messageRepository.findById(adminQuestionRequest.getId());

        if (!messageOpt.isPresent()) {
            throw new Exception("Message not found");
        }

        Message message = messageOpt.get();

        message.setResponse(adminQuestionRequest.getResponse());
        message.setClosed(true);
        messageRepository.save(message);
    }
}
