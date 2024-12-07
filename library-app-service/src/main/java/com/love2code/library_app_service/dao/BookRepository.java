package com.love2code.library_app_service.dao;

import com.love2code.library_app_service.entity.Book;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BookRepository extends JpaRepository<Book, Long> {
}
