package com.passplz.controller;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.http.ResponseEntity;
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
import com.passplz.service.PasswordEntryService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/passwords")
public class PasswordEntryController {

    private final PasswordEntryService passwordEntryService;

    @GetMapping
    public ResponseEntity<List<PasswordEntryDto>> getAllEntries() {
        log.info("received request to get all password entries");
        final List<PasswordEntryDto> entries = passwordEntryService.getAllEntries()
            .stream()
            .map(PasswordEntryDto::toDto)
            .collect(Collectors.toList());
        return ResponseEntity.ok(entries);
    }

    @GetMapping("/{id}")
    public ResponseEntity<PasswordEntryDto> getEntryById(@PathVariable Long id) {
        log.info("received request to get password entry with id: {}", id);
        final PasswordEntry entry = passwordEntryService.getEntryById(id);

        if (entry == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(PasswordEntryDto.toDto(entry));
    }

    @PostMapping
    public ResponseEntity<PasswordEntryDto> createEntry(
        @Valid @RequestBody PasswordEntryDto entryDto) {
        log.info("received request to create password entry");
        PasswordEntry entryEntity = PasswordEntryDto.toEntity(entryDto);

        final PasswordEntry createdEntry = passwordEntryService.createEntry(entryEntity);
        return ResponseEntity.ok(PasswordEntryDto.toDto(createdEntry));
    }

    @PutMapping("/{id}")
    public ResponseEntity<PasswordEntryDto> updateEntry(
        @PathVariable Long id,
        @Valid @RequestBody PasswordEntryDto entryDto) {
        log.info("received request to update password entry with id: {}", id);
        final PasswordEntry entryEntity = PasswordEntryDto.toEntity(entryDto);
        final PasswordEntry updatedEntry = passwordEntryService.updateEntry(id, entryEntity);

        if (updatedEntry == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(PasswordEntryDto.toDto(updatedEntry));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEntry(@PathVariable Long id) {
        log.info("received request to delete password entry with id: {}", id);
        final boolean isDeleted = passwordEntryService.deleteEntry(id);
        return isDeleted ? ResponseEntity.ok().build() : ResponseEntity.notFound().build();
    }

}
