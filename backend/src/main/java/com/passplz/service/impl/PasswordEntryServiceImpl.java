package com.passplz.service.impl;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import com.passplz.entity.PasswordEntry;
import com.passplz.entity.User;
import com.passplz.exception.ApplicationException;
import com.passplz.repository.PasswordEntryRepository;
import com.passplz.service.PasswordEntryService;
import com.passplz.service.UserService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class PasswordEntryServiceImpl implements PasswordEntryService {

    private final UserService userService;
    private final PasswordEntryRepository passwordEntryRepository;

    @Override
    public List<PasswordEntry> getAllEntries() {
        try {
            return passwordEntryRepository.findAll();
        } catch (Exception exception) {
            log.error("error fetching passwords: {}", exception.getMessage());
            throw new ApplicationException("error fetching passwords");
        }
    }

    @Override
    public PasswordEntry getEntryById(Long id) {
        try {
            return passwordEntryRepository.findById(id).orElse(null);
        } catch (Exception exception) {
            log.error("error fetching password with id {}:", id, exception);
            throw new ApplicationException(
                String.format("error fetching the password with id %d", id));
        }
    }

    @Override
    public PasswordEntry createEntry(PasswordEntry entry) {
        try {
            final User user = userService.getUserById(entry.getUser().getId());

            if (user == null) {
                throw new ApplicationException("user not found");
            }
            entry.setUser(user);
            entry.setCreatedDate(LocalDateTime.now());
            entry.setUpdatedDate(LocalDateTime.now());

            return passwordEntryRepository.save(entry);
        } catch (Exception exception) {
            log.error("error creating password: {}", exception.getMessage());
            throw new ApplicationException("error creating the password");
        }
    }

    @Override
    public PasswordEntry updateEntry(Long id, PasswordEntry updatedEntry) {
        try {
            return passwordEntryRepository.findById(id).map(existingEntry -> {
                existingEntry.setName(updatedEntry.getName());
                existingEntry.setUsername(updatedEntry.getUsername());
                existingEntry.setPassword(updatedEntry.getPassword());
                existingEntry.setCategory(updatedEntry.getCategory());
                existingEntry.setLink(updatedEntry.getLink());
                existingEntry.setNote(updatedEntry.getNote());
                existingEntry.setTags(updatedEntry.getTags());
                existingEntry.setExpiration(updatedEntry.getExpiration());
                existingEntry.setUpdatedDate(LocalDateTime.now());

                return passwordEntryRepository.save(existingEntry);
            }).orElse(null);
        } catch (Exception exception) {
            log.error("error updating password with id {}:", id, exception);
            throw new ApplicationException(
                String.format("error updating the password for id %d", id));
        }
    }

    @Override
    public boolean deleteEntry(Long id) {
        try {
            return passwordEntryRepository.findById(id).map(entry -> {
                passwordEntryRepository.delete(entry);
                return true;
            }).orElse(false);
        } catch (Exception exception) {
            log.error("error deleting password with id {}:", id, exception);
            throw new ApplicationException(
                String.format("error deleting the password for id %d", id));
        }
    }

}
