// src/main/java/com/example/markdownblog/repository/PostRepository.java

package com.example.markdownblog.repository;

import com.example.markdownblog.model.Post;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PostRepository extends JpaRepository<Post, Long> {
    Optional<Post> findBySlug(String slug);
}