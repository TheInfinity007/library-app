package com.love2code.library_app_service.service;

import com.love2code.library_app_service.dao.BookRepository;
import com.love2code.library_app_service.entity.Book;
import com.love2code.library_app_service.requestmodels.AddBookRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class AdminService {

    private final BookRepository bookRepository;

    @Autowired
    AdminService(BookRepository bookRepository) {
        this.bookRepository = bookRepository;
    }

    public Book addBook(AddBookRequest addBookRequest) {
        Book book = new Book();

        book.setTitle(addBookRequest.getTitle());
        book.setAuthor(addBookRequest.getAuthor());
        book.setDescription(addBookRequest.getDescription());
        book.setCategory(addBookRequest.getCategory());
        book.setImg(addBookRequest.getImg());
        book.setCopies(addBookRequest.getCopies());
        book.setCopiesAvailable(addBookRequest.getCopies());

        bookRepository.save(book);

        return book;
    }
}
