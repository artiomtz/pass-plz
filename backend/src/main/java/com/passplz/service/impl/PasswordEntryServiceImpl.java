package com.passplz.service.impl;

import com.passplz.model.PasswordEntry;
import com.passplz.repository.PasswordEntryRepository;
import com.passplz.service.PasswordEntryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PasswordEntryServiceImpl implements PasswordEntryService {

    private final PasswordEntryRepository repository;

    @Autowired
    public PasswordEntryServiceImpl(PasswordEntryRepository repository) {
        this.repository = repository;
    }

    @Override
    public List<PasswordEntry> getAllEntries() {
        throw new UnsupportedOperationException("Unimplemented method 'getAllEntries'");
    }

    @Override
    public PasswordEntry getEntryById(Long id) {
        throw new UnsupportedOperationException("Unimplemented method 'getEntryById'");
    }

    @Override
    public PasswordEntry createEntry(PasswordEntry entry) {
        throw new UnsupportedOperationException("Unimplemented method 'createEntry'");
    }

    @Override
    public PasswordEntry updateEntry(Long id, PasswordEntry entry) {
        throw new UnsupportedOperationException("Unimplemented method 'updateEntry'");
    }

    @Override
    public void deleteEntry(Long id) {
        throw new UnsupportedOperationException("Unimplemented method 'deleteEntry'");
    }

}
