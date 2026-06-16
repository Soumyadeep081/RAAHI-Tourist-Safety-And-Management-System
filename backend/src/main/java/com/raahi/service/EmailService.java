package com.raahi.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    public void sendVerificationEmail(String to, String name, String code) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(to);
            message.setSubject("Verify Your Raahi Account");
            
            String verificationUrl = "http://localhost:8080/api/auth/verify?code=" + code;
            
            String body = "Hi " + name + ",\n\n"
                    + "Welcome to Raahi! We are thrilled to have you on board.\n"
                    + "Please click the link below to verify your email address and activate your account:\n\n"
                    + verificationUrl + "\n\n"
                    + "If you did not request this, please ignore this email.\n\n"
                    + "Stay safe,\nThe Raahi Team";
            
            message.setText(body);
            mailSender.send(message);
            
            log.info("Verification email sent successfully to: {}", to);
        } catch (Exception e) {
            log.error("Failed to send verification email to: {}. Error: {}", to, e.getMessage());
            // We log the error but don't throw an exception to prevent registration from failing
            // just because the SMTP config (App Password) is missing.
        }
    }

    public void sendSOSTrackingEmail(String to, String contactName, String userName, Long alertId, double latitude, double longitude, String alertMessage) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(to);
            message.setSubject("🚨 EMERGENCY: SOS Alert Triggered by " + userName);

            String trackingUrl = "http://127.0.0.1:5500/html/alert-tracking.html?id=" + alertId;
            String msgText = (alertMessage != null && !alertMessage.trim().isEmpty()) ? "\"" + alertMessage + "\"" : "No details provided.";

            String body = "Hi " + contactName + ",\n\n"
                    + "🚨 This is an emergency notification from Raahi. 🚨\n\n"
                    + userName + " has triggered a distress SOS alert!\n\n"
                    + "Details:\n"
                    + "• Distress Message: " + msgText + "\n"
                    + "• Location Coordinates: Latitude " + latitude + ", Longitude " + longitude + "\n"
                    + "• Map / Tracking URL: " + trackingUrl + "\n\n"
                    + "Please click the link above to trace their live coordinates and emergency resolution progress.\n\n"
                    + "Stay safe,\nThe Raahi Team";

            message.setText(body);
            mailSender.send(message);

            log.info("SOS alert email sent successfully to: {}", to);
        } catch (Exception e) {
            log.error("Failed to send SOS email to: {}. Error: {}", to, e.getMessage());
        }
    }
}
