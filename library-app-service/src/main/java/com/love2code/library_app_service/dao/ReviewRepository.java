package com.love2code.library_app_service.dao;

import com.love2code.library_app_service.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReviewRepository extends JpaRepository<Review, Long> {
}
