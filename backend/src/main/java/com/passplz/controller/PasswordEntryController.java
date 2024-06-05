package com.passplz.controller;

import com.passplz.model.PasswordEntry;
import com.passplz.service.PasswordEntryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/passwords")
public class PasswordEntryController {

    @Autowired
    private PasswordEntryService passwordEntryService;

    @GetMapping
    public ResponseEntity<List<PasswordEntry>> getAllEntries() {
        List<PasswordEntry> entries = passwordEntryService.getAllEntries();
        return ResponseEntity.ok(entries);
    }

    @GetMapping("/{id}")
    public ResponseEntity<PasswordEntry> getEntryById(@PathVariable Long id) {
        PasswordEntry entry = passwordEntryService.getEntryById(id);
        if (entry == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(entry);
    }

    @PostMapping
    public ResponseEntity<PasswordEntry> createEntry(@RequestBody PasswordEntry entry) {
        PasswordEntry createdEntry = passwordEntryService.createEntry(entry);
        return ResponseEntity.ok(createdEntry);
    }

    @PutMapping("/{id}")
    public ResponseEntity<PasswordEntry> updateEntry(@PathVariable Long id, @RequestBody PasswordEntry entry) {
        PasswordEntry updatedEntry = passwordEntryService.updateEntry(id, entry);
        if (updatedEntry == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(updatedEntry);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEntry(@PathVariable Long id) {
        boolean isDeleted = passwordEntryService.deleteEntry(id);
        if (isDeleted) {
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
