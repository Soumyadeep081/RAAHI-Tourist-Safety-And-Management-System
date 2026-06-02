package com.raahi.controller;

import com.raahi.entity.User;
import com.raahi.repository.UserRepository;
import lombok.*;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @GetMapping("/profile")
    public ResponseEntity<User> getProfile(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(user);
    }

    @PutMapping("/profile")
    public ResponseEntity<User> updateProfile(
            @AuthenticationPrincipal User currentUser,
            @RequestBody ProfileUpdateRequest request) {
        
        currentUser.setName(request.getName());
        currentUser.setPhone(request.getPhone());
        
        User updated = userRepository.save(currentUser);
        return ResponseEntity.ok(updated);
    }

    @PutMapping("/password")
    public ResponseEntity<String> changePassword(
            @AuthenticationPrincipal User currentUser,
            @RequestBody PasswordChangeRequest request) {
        
        if (!passwordEncoder.matches(request.getCurrentPassword(), currentUser.getPassword())) {
            return ResponseEntity.badRequest().body("Current password does not match");
        }
        
        currentUser.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(currentUser);
        return ResponseEntity.ok("Password changed successfully");
    }

    @Data
    public static class ProfileUpdateRequest {
        private String name;
        private String phone;
    }

    @Data
    public static class PasswordChangeRequest {
        private String currentPassword;
        private String newPassword;
    }
}
