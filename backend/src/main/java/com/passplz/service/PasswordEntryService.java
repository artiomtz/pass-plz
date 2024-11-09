package com.passplz.service;

import java.util.List;

import com.passplz.entity.PasswordEntry;

public interface PasswordEntryService {

    List<PasswordEntry> getAllEntries();

    PasswordEntry getEntryById(Long id);

    PasswordEntry createEntry(PasswordEntry entry);

    PasswordEntry updateEntry(Long id, PasswordEntry entry);

    boolean deleteEntry(Long id);

}
