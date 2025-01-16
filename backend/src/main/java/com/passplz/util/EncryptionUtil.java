package com.passplz.util;

import java.security.SecureRandom;
import java.util.Base64;

import javax.crypto.Cipher;
import javax.crypto.spec.GCMParameterSpec;
import javax.crypto.spec.SecretKeySpec;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import com.passplz.exception.ApplicationException;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
public class EncryptionUtil {

    @Value("${security.aes.encryptionKey}")
    private String encryptionKey;

    private static final int IV_LENGTH = 12;
    private static final int GCM_TAG_LENGTH = 16;
    private static final String ALGORITHM = "AES";
    private static final String TRANSFORMATION = "AES/GCM/NoPadding";

    public String encrypt(String data) {
        try {
            final Cipher cipher = Cipher.getInstance(TRANSFORMATION);
            final byte[] iv = generateIv();
            final GCMParameterSpec parameterSpec = new GCMParameterSpec(GCM_TAG_LENGTH * 8, iv);

            cipher.init(Cipher.ENCRYPT_MODE, getSecretKey(), parameterSpec);
            final byte[] encryptedData = cipher.doFinal(data.getBytes());
            final byte[] encryptedWithIv = new byte[iv.length + encryptedData.length];

            System.arraycopy(iv, 0, encryptedWithIv, 0, iv.length);
            System.arraycopy(encryptedData, 0, encryptedWithIv, iv.length, encryptedData.length);
            return Base64.getEncoder().encodeToString(encryptedWithIv);
        } catch (Exception exception) {
            log.error("error encrypting data: {}", exception.getMessage());
            throw new ApplicationException("error encrypting data");
        }
    }

    public String decrypt(String encryptedData) {
        try {
            final byte[] encryptedWithIv = Base64.getDecoder().decode(encryptedData);
            final byte[] iv = new byte[IV_LENGTH];
            final byte[] encryptedBytes = new byte[encryptedWithIv.length - IV_LENGTH];

            System.arraycopy(encryptedWithIv, 0, iv, 0, IV_LENGTH);
            System.arraycopy(encryptedWithIv, IV_LENGTH, encryptedBytes, 0, encryptedBytes.length);

            final Cipher cipher = Cipher.getInstance(TRANSFORMATION);
            final GCMParameterSpec parameterSpec = new GCMParameterSpec(GCM_TAG_LENGTH * 8, iv);

            cipher.init(Cipher.DECRYPT_MODE, getSecretKey(), parameterSpec);
            final byte[] originalData = cipher.doFinal(encryptedBytes);
            return new String(originalData);
        } catch (Exception exception) {
            log.error("error decrypting data: {}", exception.getMessage());
            throw new ApplicationException("error decrypting data");
        }
    }

    private SecretKeySpec getSecretKey() {
        try {
            final byte[] keyBytes = encryptionKey.getBytes();
            return new SecretKeySpec(keyBytes, ALGORITHM);
        } catch (Exception exception) {
            log.error("invalid encryption key configuration: {}", exception.getMessage());
            throw new ApplicationException("invalid encryption key configuration");
        }
    }

    private byte[] generateIv() {
        try {
            final SecureRandom secureRandom = new SecureRandom();
            byte[] iv = new byte[IV_LENGTH];
            secureRandom.nextBytes(iv);
            return iv;
        } catch (Exception exception) {
            log.error("error generating encryption IV: {}", exception.getMessage());
            throw new ApplicationException("error generating encryption IV");
        }
    }

}
