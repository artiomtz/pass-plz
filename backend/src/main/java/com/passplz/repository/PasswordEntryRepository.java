package com.passplz.repository;

import com.passplz.model.PasswordEntry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PasswordEntryRepository extends JpaRepository<PasswordEntry, Long> {
    // custom query methods if needed
}
