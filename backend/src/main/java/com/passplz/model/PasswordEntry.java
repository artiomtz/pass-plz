package com.passplz.model;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import java.time.LocalDateTime;
import java.util.List;
import lombok.Data;

@Data
@Entity
public class PasswordEntry {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String username;
    private String password;
    private LocalDateTime createdDate;
    private LocalDateTime updatedDate;

    // optionals:
    private String group;
    private String link;
    private String note;
    private List<String> tags;
    private LocalDateTime expiration;

}
