package com.raahi.service;

import com.raahi.config.JwtUtil;
import com.raahi.dto.AuthRequest;
import com.raahi.dto.AuthResponse;
import com.raahi.dto.RegisterRequest;
import com.raahi.entity.User;
import com.raahi.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final EmailService emailService;

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered");
        }

        String verificationCode = java.util.UUID.randomUUID().toString();

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .phone(request.getPhone())
                .role(User.Role.TOURIST)
                .isVerified(false)
                .verificationCode(verificationCode)
                .build();

        user = userRepository.save(user);

        System.out.println("==================================================");
        System.out.println("Registration successful. Please verify your email.");
        System.out.println("Verification Link: http://localhost:8080/api/auth/verify?code=" + verificationCode);
        System.out.println("==================================================");
        
        emailService.sendVerificationEmail(user.getEmail(), user.getName(), verificationCode);

        return AuthResponse.builder()
                .message("Registration successful. Please check your email to verify your account.")
                .build();
    }

    public AuthResponse login(AuthRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));

        if (!user.isVerified()) {
            throw new RuntimeException("Please verify your email before logging in. Check your console for the link.");
        }

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid email or password");
        }

        String token = jwtUtil.generateToken(user.getEmail(), user.getId());

        return AuthResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .token(token)
                .message("Login successful")
                .build();
    }

    public String verifyEmail(String code) {
        User user = userRepository.findByVerificationCode(code)
                .orElseThrow(() -> new RuntimeException("Invalid verification code"));
        
        user.setVerified(true);
        user.setVerificationCode(null);
        userRepository.save(user);
        
        return "Email verified successfully! You can now log in.";
    }
}
