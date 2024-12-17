package com.love2code.library_app_service.dao;

import com.love2code.library_app_service.entity.Message;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MessageRepository extends JpaRepository<Message, Long> {
}
