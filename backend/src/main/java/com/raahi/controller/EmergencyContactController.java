package com.raahi.controller;

import com.raahi.dto.EmergencyContactDTO;
import com.raahi.entity.User;
import com.raahi.service.EmergencyContactService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/contacts")
@RequiredArgsConstructor
public class EmergencyContactController {

    private final EmergencyContactService contactService;

    @PostMapping
    public ResponseEntity<EmergencyContactDTO> addContact(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody EmergencyContactDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(contactService.addContact(user, dto));
    }

    @GetMapping
    public ResponseEntity<List<EmergencyContactDTO>> getContacts(
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(contactService.getContacts(user.getId()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteContact(
            @AuthenticationPrincipal User user,
            @PathVariable Long id) {
        contactService.deleteContact(id, user.getId());
        return ResponseEntity.noContent().build();
    }
}
