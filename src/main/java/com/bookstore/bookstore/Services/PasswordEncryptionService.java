package com.bookstore.bookstore.Services;

import org.springframework.stereotype.Service;
import javax.crypto.*;
import javax.crypto.spec.SecretKeySpec;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.util.Arrays;
import java.util.Base64;

import static com.bookstore.bookstore.Services.AuthJwt.cipher;

@Service
public class PasswordEncryptionService {

    private static final String SECRET_KEY = "your-secret-key"; // Change this to a valid length key

    public static String encrypt(String data) {
        try {
            Cipher cipher = Cipher.getInstance("AES");
            byte[] keyBytes = Arrays.copyOf(SECRET_KEY.getBytes("UTF-8"), 16); // 16 bytes for AES-128
            SecretKeySpec secretKeySpec = new SecretKeySpec(keyBytes, "AES");
            cipher.init(Cipher.ENCRYPT_MODE, secretKeySpec);

            byte[] encryptedBytes = cipher.doFinal(data.getBytes("UTF-8"));
            return Base64.getEncoder().encodeToString(encryptedBytes);
        } catch (Exception ex) {
            return ex.getMessage();
        }
    }

    public static String decrypt(String encryptedData) {
        try {
            Cipher cipher = Cipher.getInstance("AES");

            byte[] keyBytes = Arrays.copyOf(SECRET_KEY.getBytes("UTF-8"), 16); // 16 bytes for AES-128
            SecretKeySpec secretKeySpec = new SecretKeySpec(keyBytes, "AES");
            cipher.init(Cipher.DECRYPT_MODE, secretKeySpec);

            byte[] decryptedBytes = cipher.doFinal(Base64.getDecoder().decode(encryptedData));
            return new String(decryptedBytes, "UTF-8");
        } catch (Exception ex) {
            return ex.getMessage();
        }
    }
}
