package com.love2code.library_app_service.dao;

import com.love2code.library_app_service.entity.Book;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.web.bind.annotation.RequestParam;

public interface BookRepository extends JpaRepository<Book, Long> {

    /*
    In Spring Data JPA, query methods are derived based on the method name.
    The method name is parsed by Spring Data, and
    it automatically generates the query based on the name of the method

    findBy: Indicates a search query (like a SELECT statement).
    Title: Refers to the title field of the Book entity.
    Containing: Informs Spring Data that the query should perform a partial match (LIKE) rather than an exact match (=).
     */
    Page<Book> findByTitleContaining(@RequestParam("title") String title, Pageable pageable);
}
