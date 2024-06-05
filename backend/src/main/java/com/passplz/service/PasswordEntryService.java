package com.passplz.service;

import com.passplz.model.PasswordEntry;

import java.util.List;

public interface PasswordEntryService {
    List<PasswordEntry> getAllEntries();

    PasswordEntry getEntryById(Long id);

    PasswordEntry createEntry(PasswordEntry entry);

    PasswordEntry updateEntry(Long id, PasswordEntry entry);

    boolean deleteEntry(Long id);
}
