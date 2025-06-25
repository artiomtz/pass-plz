package com.passplz.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.passplz.config.TokenType;
import com.passplz.entity.Token;
import com.passplz.entity.User;

@Repository
public interface TokenRepository extends JpaRepository<Token, Long> {

    @Modifying
    @Query("DELETE FROM Token t WHERE t.expiryDate < :now OR t.isValid = false")
    void deleteExpiredTokens(@Param("now") LocalDateTime now);

    @Modifying
    @Query("UPDATE Token t SET t.isValid = false WHERE t.user = :user AND t.isValid = true")
    int invalidateAllTokensForUser(@Param("user") User user);

    @Query("SELECT t FROM Token t WHERE t.type = :type")
    List<Token> findAllByType(@Param("type") TokenType type);

    @Query("SELECT t FROM Token t JOIN FETCH t.user WHERE t.type = :type")
    List<Token> findAllByTypeFetchUser(@Param("type") TokenType type);

}
