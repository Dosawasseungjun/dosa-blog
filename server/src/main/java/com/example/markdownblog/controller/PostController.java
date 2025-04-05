package com.example.markdownblog.controller;

import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.util.ResourceUtils;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.context.annotation.Bean;
import org.springframework.beans.factory.annotation.Value;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.charset.StandardCharsets;
import java.nio.file.attribute.BasicFileAttributes;
import java.text.SimpleDateFormat;
import java.util.*;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class PostController {

    @Value("${posts.path:posts}")
    private String postsPath;

    private static final String IMAGES_PATH = "images";
    private static final SimpleDateFormat DATE_FORMAT = new SimpleDateFormat("yyyy년 MM월 dd일");

    private File getPostsDirectory() throws FileNotFoundException {
        // 개발 환경에서는 src/main/resources/posts를 사용
        File devDir = new File("src/main/resources/" + postsPath);
        if (devDir.exists()) {
            return devDir;
        }
        
        // 프로덕션 환경에서는 classpath:posts를 사용
        Resource resource = new ClassPathResource(postsPath);
        if (resource.exists()) {
            try {
                return resource.getFile();
            } catch (IOException e) {
                // 파일 접근에 실패하면 새 디렉토리 생성
                File prodDir = new File(postsPath);
                if (!prodDir.exists()) {
                    prodDir.mkdirs();
                }
                return prodDir;
            }
        }
        
        // 디렉토리가 없으면 생성
        File prodDir = new File(postsPath);
        if (!prodDir.exists()) {
            prodDir.mkdirs();
        }
        return prodDir;
    }

    @GetMapping(value = "/posts", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> getDirectoryStructure() {
        try {
            File baseFolder = getPostsDirectory();
            Map<String, Object> structure = getStructure(baseFolder);
            return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_JSON)
                .header("Access-Control-Allow-Origin", "*")
                .header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
                .header("Access-Control-Allow-Headers", "*")
                .body(structure);
        } catch (IOException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "폴더 구조를 가져오는데 실패했습니다.");
            error.put("details", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .contentType(MediaType.APPLICATION_JSON)
                .header("Access-Control-Allow-Origin", "*")
                .body(error);
        }
    }

    private Map<String, Object> getStructure(File folder) {
        Map<String, Object> result = new HashMap<>();
        try {
            String folderName = new String(folder.getName().getBytes(StandardCharsets.ISO_8859_1), StandardCharsets.UTF_8);
            result.put("name", folderName);
            result.put("path", folder.getPath());
            result.put("type", "directory");

            List<Map<String, Object>> children = new ArrayList<>();
            File[] files = folder.listFiles();
            
            if (files != null) {
                for (File file : files) {
                    if (file.isDirectory()) {
                        children.add(getStructure(file));
                    } else if (file.getName().endsWith(".md")) {
                        children.add(createFileNode(file));
                    }
                }
            }
            
            result.put("children", children);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return result;
    }

    @GetMapping("/categories")
    public ResponseEntity<List<String>> getCategories() {
        try {
            File baseFolder = getPostsDirectory();
            String[] directories = baseFolder.list((file, name) -> new File(file, name).isDirectory());

            List<String> categoryList = directories != null
                    ? Arrays.asList(directories)
                    : new ArrayList<>();

            return ResponseEntity.ok(categoryList);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(List.of("카테고리를 불러올 수 없습니다."));
        }
    }

    @GetMapping("/posts/{category}")
    public ResponseEntity<List<String>> getPostsByCategory(@PathVariable String category) {
        try {
            File categoryFolder = new ClassPathResource(postsPath + "/" + category).getFile();
            String[] files = categoryFolder.list((file, name) -> name.endsWith(".md"));

            List<String> slugs = files != null
                    ? Arrays.stream(files).map(name -> name.replace(".md", "")).toList()
                    : new ArrayList<>();

            return ResponseEntity.ok(slugs);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(List.of("해당 카테고리를 찾을 수 없습니다."));
        }
    }

    @GetMapping("/posts/{*path}")
    public ResponseEntity<Map<String, String>> getPost(@PathVariable String path) {
        try {
            // URL 디코딩
            path = java.net.URLDecoder.decode(path, StandardCharsets.UTF_8.name());
            
            // 경로에서 마지막 부분을 slug로 사용
            String[] pathParts = path.split("/");
            String slug = pathParts[pathParts.length - 1];
            
            // 전체 파일 경로 생성
            String filePath = postsPath + "/" + path + ".md";
            
            // 파일 존재 여부 확인
            File mdFile = null;
            try {
                mdFile = new ClassPathResource(filePath).getFile();
            } catch (IOException e) {
                // 파일을 찾을 수 없는 경우, 디렉토리 내의 모든 파일을 검색
                File baseDir = getPostsDirectory();
                File targetDir = new File(baseDir, path.substring(0, path.lastIndexOf('/')));
                
                if (targetDir.exists()) {
                    File[] files = targetDir.listFiles((dir, name) -> 
                        name.toLowerCase().endsWith(".md") && 
                        name.toLowerCase().replace(".md", "").equals(slug.toLowerCase())
                    );
                    
                    if (files != null && files.length > 0) {
                        mdFile = files[0];
                    }
                }
            }
            
            if (mdFile == null || !mdFile.exists()) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "포스트를 찾을 수 없습니다.");
                error.put("details", "파일이 존재하지 않습니다: " + filePath);
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
            }
            
            String content = Files.readString(mdFile.toPath(), StandardCharsets.UTF_8);
            
            // 파일의 수정 날짜 가져오기
            BasicFileAttributes attrs = Files.readAttributes(mdFile.toPath(), BasicFileAttributes.class);
            String lastModifiedDate = DATE_FORMAT.format(new Date(attrs.lastModifiedTime().toMillis()));

            Map<String, String> response = new HashMap<>();
            response.put("title", slug.replace("-", " "));
            response.put("slug", slug);
            response.put("path", path);
            response.put("content", content);
            response.put("date", lastModifiedDate);

            return ResponseEntity.ok(response);
        } catch (IOException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "포스트를 불러올 수 없습니다.");
            error.put("details", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        }
    }

    @GetMapping("/images/{imageName}")
    public ResponseEntity<?> getImage(@PathVariable String imageName) {
        try {
            ClassPathResource resource = new ClassPathResource(IMAGES_PATH + "/" + imageName);
            byte[] imageBytes = Files.readAllBytes(resource.getFile().toPath());
            
            String contentType = determineContentType(imageName);
            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .body(imageBytes);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "이미지를 찾을 수 없습니다.", "details", e.getMessage()));
        }
    }

    private String determineContentType(String fileName) {
        String extension = fileName.substring(fileName.lastIndexOf(".") + 1).toLowerCase();
        return switch (extension) {
            case "jpg", "jpeg" -> "image/jpeg";
            case "png" -> "image/png";
            case "gif" -> "image/gif";
            case "svg" -> "image/svg+xml";
            default -> "application/octet-stream";
        };
    }

    @GetMapping("/recent-posts")
    public ResponseEntity<List<Map<String, String>>> getRecentPosts() {
        try {
            File baseFolder = getPostsDirectory();
            List<Map<String, String>> recentPosts = new ArrayList<>();
            
            // 모든 마크다운 파일을 재귀적으로 찾기
            findMarkdownFiles(baseFolder, recentPosts);
            
            // 수정 날짜 기준으로 정렬
            recentPosts.sort((a, b) -> b.get("date").compareTo(a.get("date")));
            
            // 모든 포스트 반환
            return ResponseEntity.ok(recentPosts);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(List.of(Map.of("error", "최근 포스트를 불러오는데 실패했습니다.", "details", e.getMessage())));
        }
    }

    private void findMarkdownFiles(File folder, List<Map<String, String>> posts) throws IOException {
        File[] files = folder.listFiles();
        if (files != null) {
            for (File file : files) {
                if (file.isDirectory()) {
                    findMarkdownFiles(file, posts);
                } else if (file.getName().endsWith(".md")) {
                    Map<String, String> post = new HashMap<>();
                    
                    // 상대 경로 계산
                    String relativePath = file.getPath().substring(
                        file.getPath().indexOf(postsPath) + postsPath.length() + 1
                    ).replace(".md", "");
                    
                    // 파일의 수정 날짜 가져오기
                    BasicFileAttributes attrs = Files.readAttributes(file.toPath(), BasicFileAttributes.class);
                    String lastModifiedDate = DATE_FORMAT.format(new Date(attrs.lastModifiedTime().toMillis()));
                    
                    post.put("title", file.getName().replace(".md", ""));
                    post.put("path", relativePath);
                    post.put("date", lastModifiedDate);
                    
                    posts.add(post);
                }
            }
        }
    }

    @GetMapping("/search")
    public ResponseEntity<List<Map<String, String>>> searchPosts(@RequestParam String q) {
        try {
            File baseFolder = getPostsDirectory();
            List<Map<String, String>> searchResults = new ArrayList<>();
            
            // 검색어를 소문자로 변환
            String searchQuery = q.toLowerCase();
            
            // 모든 마크다운 파일을 재귀적으로 검색
            searchMarkdownFiles(baseFolder, searchQuery, searchResults);
            
            return ResponseEntity.ok(searchResults);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(List.of(Map.of("error", "검색 중 오류가 발생했습니다.", "details", e.getMessage())));
        }
    }

    private void searchMarkdownFiles(File folder, String query, List<Map<String, String>> results) throws IOException {
        File[] files = folder.listFiles();
        if (files != null) {
            for (File file : files) {
                if (file.isDirectory()) {
                    searchMarkdownFiles(file, query, results);
                } else if (file.getName().endsWith(".md")) {
                    String content = Files.readString(file.toPath(), StandardCharsets.UTF_8);
                    String title = file.getName().replace(".md", "");
                    
                    // 제목이나 내용에서 검색어를 찾음
                    if (title.toLowerCase().contains(query) || content.toLowerCase().contains(query)) {
                        Map<String, String> result = new HashMap<>();
                        
                        // 상대 경로 계산
                        String relativePath = file.getPath().substring(
                            file.getPath().indexOf(postsPath) + postsPath.length() + 1
                        ).replace(".md", "");
                        
                        // 파일의 수정 날짜 가져오기
                        BasicFileAttributes attrs = Files.readAttributes(file.toPath(), BasicFileAttributes.class);
                        String lastModifiedDate = DATE_FORMAT.format(new Date(attrs.lastModifiedTime().toMillis()));
                        
                        // 검색어 주변의 텍스트를 발췌 (간단한 구현)
                        String excerpt = "";
                        int queryIndex = content.toLowerCase().indexOf(query);
                        if (queryIndex >= 0) {
                            int start = Math.max(0, queryIndex - 50);
                            int end = Math.min(content.length(), queryIndex + 50);
                            excerpt = content.substring(start, end);
                            if (start > 0) excerpt = "..." + excerpt;
                            if (end < content.length()) excerpt = excerpt + "...";
                        }
                        
                        result.put("title", title);
                        result.put("path", relativePath);
                        result.put("date", lastModifiedDate);
                        result.put("excerpt", excerpt);
                        
                        results.add(result);
                    }
                }
            }
        }
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Collections.singletonList("*"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Collections.singletonList("*"));
        configuration.setExposedHeaders(Arrays.asList("Access-Control-Allow-Origin", "Access-Control-Allow-Methods", "Access-Control-Allow-Headers"));
        configuration.setAllowCredentials(false);
        configuration.setMaxAge(3600L);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    private Map<String, Object> createFileNode(File file) {
        Map<String, Object> node = new HashMap<>();
        try {
            String fileName = new String(file.getName().getBytes(StandardCharsets.ISO_8859_1), StandardCharsets.UTF_8);
            node.put("name", fileName.replace(".md", ""));
            node.put("path", file.getPath());
            node.put("type", "file");
            
            // 파일의 메타데이터 추가
            BasicFileAttributes attrs = Files.readAttributes(file.toPath(), BasicFileAttributes.class);
            node.put("created", DATE_FORMAT.format(new Date(attrs.creationTime().toMillis())));
            node.put("modified", DATE_FORMAT.format(new Date(attrs.lastModifiedTime().toMillis())));
        } catch (Exception e) {
            e.printStackTrace();
        }
        return node;
    }
}
