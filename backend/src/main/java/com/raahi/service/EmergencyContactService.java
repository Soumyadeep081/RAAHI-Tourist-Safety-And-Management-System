package com.raahi.service;

import com.raahi.dto.EmergencyContactDTO;
import com.raahi.entity.EmergencyContact;
import com.raahi.entity.User;
import com.raahi.repository.EmergencyContactRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EmergencyContactService {

    private final EmergencyContactRepository contactRepository;

    public EmergencyContactDTO addContact(User user, EmergencyContactDTO dto) {
        EmergencyContact contact = EmergencyContact.builder()
                .user(user)
                .name(dto.getName())
                .phone(dto.getPhone())
                .email(dto.getEmail())
                .relation(dto.getRelation())
                .build();

        contact = contactRepository.save(contact);
        return toDTO(contact);
    }

    public List<EmergencyContactDTO> getContacts(Long userId) {
        return contactRepository.findByUserId(userId)
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    public void deleteContact(Long contactId, Long userId) {
        EmergencyContact contact = contactRepository.findById(contactId)
                .orElseThrow(() -> new RuntimeException("Contact not found"));

        if (!contact.getUser().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized");
        }

        contactRepository.delete(contact);
    }

    private EmergencyContactDTO toDTO(EmergencyContact c) {
        return EmergencyContactDTO.builder()
                .id(c.getId())
                .name(c.getName())
                .phone(c.getPhone())
                .email(c.getEmail())
                .relation(c.getRelation())
                .build();
    }
}
