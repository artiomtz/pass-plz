package com.passplz.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.passplz.dto.PasswordEntryDto;
import com.passplz.entity.PasswordEntry;
import com.passplz.service.AuthenticationService;
import com.passplz.service.PasswordEntryService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@EnableMethodSecurity
@RequiredArgsConstructor
@RequestMapping("/api/passwords")
public class PasswordEntryController {

    private final PasswordEntryService passwordEntryService;
    private final AuthenticationService authenticationService;

    @GetMapping
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<List<PasswordEntryDto>> getAllEntries() {
        log.info("received request to fetch all password entries");
        final List<PasswordEntryDto> entries = passwordEntryService.getAllEntries()
            .stream()
            .map(PasswordEntryDto::toDto)
            .toList();

        log.info("successfully fetched all password entries");
        return ResponseEntity.ok(entries);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<PasswordEntryDto> getEntryById(@PathVariable Long id) {
        log.info("received request to fetch password entry with id {}", id);

        final PasswordEntry entry = passwordEntryService.getEntryById(id);
        if (entry == null) {
            log.warn("couldn't fetch password entry with id {}", id);
            return ResponseEntity.noContent().build();
        }

        log.info("successfully fetched password entry with id {}", id);
        return ResponseEntity.ok(PasswordEntryDto.toDto(entry));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<PasswordEntryDto>> getAllEntriesByUser(@PathVariable Long userId) {
        log.info("received request to fetch all password entries for user with id {}", userId);
        authenticationService.verifyUser(userId);

        final List<PasswordEntry> entries = passwordEntryService.getAllEntriesByUserId(userId);
        if (entries.isEmpty()) {
            log.warn("couldn't fetch password entries for user with id {}", userId);
            return ResponseEntity.noContent().build();
        }

        final List<PasswordEntryDto> entryDtos = entries.stream()
            .map(PasswordEntryDto::toDto)
            .toList();
        log.info("successfully fetched password entries for user with id {}", userId);
        return ResponseEntity.ok(entryDtos);
    }

    @PostMapping
    public ResponseEntity<PasswordEntryDto> createEntry(
        @Valid @RequestBody PasswordEntryDto entryDto) {
        log.info("received request to create password entry for user with id {}",
            entryDto.getUserId());
        authenticationService.verifyUser(entryDto.getUserId());
        final PasswordEntry entryEntity = PasswordEntryDto.toEntity(entryDto);

        passwordEntryService.createEntry(entryEntity);
        log.info("successfully created password entry for user with id {}", entryDto.getUserId());
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<PasswordEntryDto> updateEntry(
        @PathVariable Long id,
        @Valid @RequestBody PasswordEntryDto entryDto) {
        log.info("received request to update password entry with id {}", id);
        authenticationService.verifyOwnership(entryDto.getUserId(), id);

        final PasswordEntry entryEntity = PasswordEntryDto.toEntity(entryDto);
        final PasswordEntry updatedEntry = passwordEntryService.updateEntry(id, entryEntity);
        if (updatedEntry == null) {
            log.error("couldn't update password entry with id {}", id);
            return ResponseEntity.notFound().build();
        }

        log.info("successfully updated password entry with id {}", id);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEntry(@PathVariable Long id) {
        log.info("received request to delete password entry with id {}", id);
        authenticationService.verifyOwnership(id);
        final boolean isDeleted = passwordEntryService.deleteEntry(id);

        log.info("successfully deleted password entry with id {}", id);
        return isDeleted ? ResponseEntity.ok().build() : ResponseEntity.notFound().build();
    }

}
