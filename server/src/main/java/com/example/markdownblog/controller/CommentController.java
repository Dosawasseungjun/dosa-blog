package com.example.markdownblog.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.ArrayList;
import java.util.Comparator;

@RestController
@RequestMapping("/api/comments")
public class CommentController {

    private static final Logger logger = LoggerFactory.getLogger(CommentController.class);

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @GetMapping("/**")
    public ResponseEntity<?> getComments(HttpServletRequest request) {
        try {
            // 전체 URL 경로에서 /api/comments/ 이후의 부분을 추출
            String fullPath = request.getRequestURI();
            String postPath = fullPath.substring("/api/comments/".length());
            
            logger.info("Fetching comments for postPath: {}", postPath);
            
            // 부모 댓글의 작성자 정보를 함께 가져오기 위해 JOIN 쿼리 사용
            String sql = "SELECT c.id, c.post_path, c.author, c.content, c.date, c.parent_id, p.author as parent_author " +
                         "FROM comments c " +
                         "LEFT JOIN comments p ON c.parent_id = p.id " +
                         "WHERE c.post_path = ? " +
                         "ORDER BY c.date ASC";
            
            RowMapper<Map<String, Object>> rowMapper = (rs, rowNum) -> {
                Map<String, Object> comment = new HashMap<>();
                comment.put("id", rs.getLong("id"));
                comment.put("postPath", rs.getString("post_path"));
                comment.put("author", rs.getString("author"));
                comment.put("content", rs.getString("content"));
                comment.put("date", rs.getTimestamp("date"));
                comment.put("parentId", rs.getObject("parent_id"));
                comment.put("parentAuthor", rs.getString("parent_author"));
                return comment;
            };
            
            List<Map<String, Object>> comments = jdbcTemplate.query(sql, rowMapper, postPath);
            logger.info("Found {} comments for postPath: {}", comments.size(), postPath);
            
            return ResponseEntity.ok(comments);
        } catch (Exception e) {
            logger.error("Error fetching comments", e);
            return ResponseEntity.status(500).body("댓글을 불러오는데 실패했습니다: " + e.getMessage());
        }
    }

    @PostMapping
    public ResponseEntity<?> createComment(@RequestBody Map<String, String> comment) {
        try {
            logger.info("Creating comment: {}", comment);
            
            String sql = "INSERT INTO comments (post_path, author, content, password, date, parent_id) VALUES (?, ?, ?, ?, NOW(), ?)";
            
            KeyHolder keyHolder = new GeneratedKeyHolder();
            
            jdbcTemplate.update(connection -> {
                PreparedStatement ps = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
                ps.setString(1, comment.get("postPath"));
                ps.setString(2, comment.get("author"));
                ps.setString(3, comment.get("content"));
                ps.setString(4, comment.get("password"));
                if (comment.get("parentId") != null) {
                    ps.setLong(5, Long.parseLong(comment.get("parentId")));
                } else {
                    ps.setObject(5, null);
                }
                return ps;
            }, keyHolder);
            
            Long id = keyHolder.getKey().longValue();
            logger.info("Created comment with id: {}", id);
            
            // 새로 생성된 댓글 정보를 가져옴
            String selectSql = "SELECT c.id, c.post_path, c.author, c.content, c.date, c.parent_id, p.author as parent_author " +
                              "FROM comments c " +
                              "LEFT JOIN comments p ON c.parent_id = p.id " +
                              "WHERE c.id = ?";
            RowMapper<Map<String, Object>> rowMapper = (rs, rowNum) -> {
                Map<String, Object> result = new HashMap<>();
                result.put("id", rs.getLong("id"));
                result.put("postPath", rs.getString("post_path"));
                result.put("author", rs.getString("author"));
                result.put("content", rs.getString("content"));
                result.put("date", rs.getTimestamp("date"));
                result.put("parentId", rs.getObject("parent_id"));
                result.put("parentAuthor", rs.getString("parent_author"));
                return result;
            };
            
            Map<String, Object> newComment = jdbcTemplate.queryForObject(selectSql, rowMapper, id);
            return ResponseEntity.ok(newComment);
        } catch (Exception e) {
            logger.error("Error creating comment: {}", comment, e);
            return ResponseEntity.status(500).body("댓글을 생성하는데 실패했습니다: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteComment(@PathVariable Long id, @RequestParam String password) {
        try {
            logger.info("Deleting comment with id: {}", id);
            
            // 비밀번호 확인
            String checkSql = "SELECT password FROM comments WHERE id = ?";
            String storedPassword = jdbcTemplate.queryForObject(checkSql, String.class, id);
            
            if (storedPassword == null || !storedPassword.equals(password)) {
                logger.warn("Password mismatch for comment id: {}", id);
                return ResponseEntity.status(403).body("비밀번호가 일치하지 않습니다.");
            }
            
            // 댓글 삭제
            String deleteSql = "DELETE FROM comments WHERE id = ?";
            jdbcTemplate.update(deleteSql, id);
            logger.info("Deleted comment with id: {}", id);
            
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            logger.error("Error deleting comment with id: {}", id, e);
            return ResponseEntity.status(500).body("댓글을 삭제하는데 실패했습니다: " + e.getMessage());
        }
    }
} 