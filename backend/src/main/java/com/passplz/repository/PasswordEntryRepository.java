package com.passplz.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.passplz.entity.PasswordEntry;
import com.passplz.entity.User;

@Repository
public interface PasswordEntryRepository extends JpaRepository<PasswordEntry, Long> {

    List<PasswordEntry> findAllByUser(User user);

}
