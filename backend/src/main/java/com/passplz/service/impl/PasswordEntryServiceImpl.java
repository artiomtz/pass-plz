package com.passplz.service.impl;

import com.passplz.model.PasswordEntry;
import com.passplz.repository.PasswordEntryRepository;
import com.passplz.service.PasswordEntryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class PasswordEntryServiceImpl implements PasswordEntryService {

    @Autowired
    private PasswordEntryRepository passwordEntryRepository;

    @Override
    public List<PasswordEntry> getAllEntries() {
        return passwordEntryRepository.findAll();
    }

    @Override
    public PasswordEntry getEntryById(Long id) {
        return passwordEntryRepository.findById(id).orElse(null);
    }

    @Override
    public PasswordEntry createEntry(PasswordEntry entry) {
        entry.setCreatedDate(LocalDateTime.now());
        entry.setUpdatedDate(LocalDateTime.now());
        return passwordEntryRepository.save(entry);
    }

    @Override
    public PasswordEntry updateEntry(Long id, PasswordEntry entry) {
        return passwordEntryRepository.findById(id).map(existingEntry -> {
            existingEntry.setName(entry.getName());
            existingEntry.setUsername(entry.getUsername());
            existingEntry.setPassword(entry.getPassword());
            existingEntry.setCategory(entry.getCategory());
            existingEntry.setLink(entry.getLink());
            existingEntry.setNote(entry.getNote());
            existingEntry.setTags(entry.getTags());
            existingEntry.setExpiration(entry.getExpiration());
            existingEntry.setUpdatedDate(LocalDateTime.now());
            return passwordEntryRepository.save(existingEntry);
        }).orElse(null);
    }

    @Override
    public boolean deleteEntry(Long id) {
        return passwordEntryRepository.findById(id).map(entry -> {
            passwordEntryRepository.delete(entry);
            return true;
        }).orElse(false);
    }
}
