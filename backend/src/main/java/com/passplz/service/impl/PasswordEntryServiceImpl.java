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
import com.passplz.util.EncryptionUtil;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class PasswordEntryServiceImpl implements PasswordEntryService {

    private final UserService userService;
    private final EncryptionUtil encryptionUtil;
    private final PasswordEntryRepository passwordEntryRepository;

    @Override
    public List<PasswordEntry> getAllEntries() {
        try {
            List<PasswordEntry> entries = passwordEntryRepository.findAll();
            entries
                .forEach(entry -> entry.setPassword(encryptionUtil.decrypt(entry.getPassword())));
            return entries;
        } catch (Exception exception) {
            log.error("error fetching passwords: {}", exception.getMessage());
            throw new ApplicationException("error fetching passwords");
        }
    }

    @Override
    public PasswordEntry getEntryById(Long id) {
        try {
            return passwordEntryRepository.findById(id).map(entry -> {
                entry.setPassword(encryptionUtil.decrypt(entry.getPassword()));
                return entry;
            }).orElse(null);
        } catch (Exception exception) {
            log.error("error fetching password with id {}: {}", id, exception.getMessage());
            throw new ApplicationException(
                String.format("error fetching the password with id %d", id));
        }
    }

    @Override
    public List<PasswordEntry> getAllEntriesByUserId(Long userId) {
        try {
            final User user = userService.getUserById(userId);
            if (user == null) {
                log.error("couldn't find user with id {} when fetching passwords", userId);
                throw new ApplicationException(
                    String.format("couldn't find user with id %s when fetching passwords", userId));
            }

            List<PasswordEntry> entries = passwordEntryRepository.findAllByUser(user);
            entries
                .forEach(entry -> entry.setPassword(encryptionUtil.decrypt(entry.getPassword())));
            return entries;
        } catch (Exception exception) {
            log.error("error fetching the passwords for user with id {}: {}",
                userId,
                exception.getMessage());
            throw new ApplicationException(
                String.format("error fetching the passwords for user with id %d", userId));
        }
    }

    @Override
    public PasswordEntry createEntry(PasswordEntry entry) {
        try {
            final User user = userService.getUserById(entry.getUser().getId());

            if (user == null) {
                log.error("couldn't find user when creating password for {}", entry.getName());
                throw new ApplicationException(
                    String.format("user not found with id %s", entry.getUser().getId()));
            }

            entry.setUser(user);
            entry.setCreatedDate(LocalDateTime.now());
            entry.setUpdatedDate(LocalDateTime.now());
            entry.setPassword(encryptionUtil.encrypt(entry.getPassword()));

            return passwordEntryRepository.save(entry);
        } catch (Exception exception) {
            log.error("error creating the password for user with id {}: {}",
                entry.getUser().getId(),
                exception.getMessage());
            throw new ApplicationException(
                String.format("error creating the password for user with id %d",
                    entry.getUser().getId()));
        }
    }

    @Override
    public PasswordEntry updateEntry(Long id, PasswordEntry updatedEntry) {
        try {
            return passwordEntryRepository.findById(id).map(existingEntry -> {
                existingEntry.setName(updatedEntry.getName());
                existingEntry.setUsername(updatedEntry.getUsername());
                existingEntry.setPassword(encryptionUtil.encrypt(updatedEntry.getPassword()));
                existingEntry.setCategory(updatedEntry.getCategory());
                existingEntry.setLink(updatedEntry.getLink());
                existingEntry.setNote(updatedEntry.getNote());
                existingEntry.setTags(updatedEntry.getTags());
                existingEntry.setExpiration(updatedEntry.getExpiration());
                existingEntry.setUpdatedDate(LocalDateTime.now());

                return passwordEntryRepository.save(existingEntry);
            }).orElse(null);
        } catch (Exception exception) {
            log.error("error updating password with id {}: {}", id, exception.getMessage());
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
            log.error("error deleting password with id {}: {}", id, exception.getMessage());
            throw new ApplicationException(
                String.format("error deleting the password for id %d", id));
        }
    }

}
