package com.springdata.permitmanagementsystem.controller;


import com.springdata.permitmanagementsystem.model.dto.UserDto;
import com.springdata.permitmanagementsystem.model.entity.User;
import com.springdata.permitmanagementsystem.service.MinioService;
import com.springdata.permitmanagementsystem.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.io.InputStream;
import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserService userService;
    private final MinioService minioService;
    public AuthController(UserService userService, MinioService minioService) {
        this.userService = userService;
        this.minioService = minioService;
    }
    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody UserDto request) {
        try{
            return ResponseEntity.ok(userService.register(request));
        }catch(Exception e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    @GetMapping("/get-user")
    public UserDto getUserByUsername(String username) {
        return userService.getUserByUsername(username);
    }
    @GetMapping("/get-all-users")
    public List<UserDto> getAllUsers() {
        return userService.getALlUser();
    }
    @GetMapping("/debug-auth")
    public ResponseEntity<?> debugAuth(Authentication auth) {
        return ResponseEntity.ok(auth.getAuthorities());
    }
    @DeleteMapping("/delete-user")
    public ResponseEntity<String> deleteUserId(Integer id) {
        return ResponseEntity.ok(userService.deleteUserById(id));
    }

    @GetMapping("/generate-file-URL")
    public String generateFileDownload(@RequestParam String objectName) throws Exception {

        return minioService.getFileDownloadUrl(objectName);
    }
    @GetMapping("/download")
    public ResponseEntity<byte[]> downloadFile(@RequestParam String objectName) throws Exception {
        try ( InputStream stream = minioService.download(objectName)) {
            byte[] content = stream.readAllBytes();

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + objectName + "\"")
                    .contentType(MediaType.APPLICATION_OCTET_STREAM)
                    .body(content);
        }
    }

}
