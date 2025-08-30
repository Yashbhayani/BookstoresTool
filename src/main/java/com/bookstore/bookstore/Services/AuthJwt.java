package com.bookstore.bookstore.Services;

import com.bookstore.bookstore.Repository.AuthJwtRepository;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.Base64;
import javax.crypto.Cipher;
import javax.crypto.SecretKey;
import javax.crypto.*;
import javax.crypto.spec.SecretKeySpec;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.util.Date;
@Service
public class AuthJwt implements AuthJwtRepository {
    @Value("${jwt.secret}")
    private String secret;
    static Cipher cipher;

    @Value("${jwt.expiration}")
    private Long expiration;

    String secretKey = "F{21d70M586kv`+TL+-x";

    // private final Key key = Keys.secretKeyFor(SignatureAlgorithm.HS512);
    private SecretKey key;


    @PostConstruct
    public void init() {
        // Initialize the key with the secret from properties file
        if (secret == null || secret.isEmpty()) {
            throw new IllegalArgumentException("JWT secret is missing.");
        }
        this.key = Keys.hmacShaKeyFor(secret.getBytes());
    }


    public String generateToken(String username, String ipv4, String ipv6, String browser, String os, String device ) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + expiration);
        try {
            return Jwts.builder()
                    .setSubject(username)
                    .setIssuedAt(now)
                    .setExpiration(expiryDate)
                    .claim("ipv4", ipv4)           // add ipv4
                    .claim("ipv6", ipv6)           // add ipv6
                    .claim("browser", browser)     // add browser
                    .claim("os", os)               // add OS
                    .claim("device", device)
                    .signWith(key)
                    .compact();
        } catch (Exception e) {
            return  e.getMessage();
        }
    }

    public String getUsernameFromToken(String token) {
        return getClaims(token).getBody().getSubject();
    }

    public String getIpv4FromToken(String token) {
        return getClaims(token).getBody().get("ipv4", String.class);
    }

    public String getIpv6FromToken(String token) {
        return getClaims(token).getBody().get("ipv6", String.class);
    }

    public String getBrowserFromToken(String token) {
        return getClaims(token).getBody().get("browser", String.class);
    }

    public String getOsFromToken(String token) {
        return getClaims(token).getBody().get("os", String.class);
    }

    public String getDeviceFromToken(String token) {
        return getClaims(token).getBody().get("device", String.class);
    }


    public Jws<Claims> getClaims(String token) {
        return Jwts.parser().setSigningKey(key).parseClaimsJws(token);
    }

    public boolean isTokenValid(String token) {
        try {
            Jws<Claims> claims = getClaims(token);
            return !claims.getBody().getExpiration().before(new Date());
        } catch (Exception e) {
            return false;
        }
    }


    @Override
    public String IdEncrypt(long bookid) throws InvalidKeyException, NoSuchPaddingException, NoSuchAlgorithmException {
        try {
            //String paddedKey  = String.valueOf(bookid);
            String paddedKey  = secretKey.substring(0, 16);
            SecretKeySpec keySpec = new SecretKeySpec(paddedKey.getBytes(), "AES");
            Cipher cipher = Cipher.getInstance("AES");
            cipher.init(Cipher.ENCRYPT_MODE, keySpec);
            byte[] encryptedBytes = cipher.doFinal(String.valueOf(bookid).getBytes());
            return Base64.getEncoder().encodeToString(encryptedBytes);
        } catch (Exception ex) {
            ex.printStackTrace();
            return null;
        }
    }

    @Override
    public String IdDecrypt(String encryptedText) throws NoSuchPaddingException, NoSuchAlgorithmException, InvalidKeyException, IllegalBlockSizeException, BadPaddingException {
        try {
            String paddedKey = secretKey.substring(0, 16);
            SecretKeySpec keySpec = new SecretKeySpec(paddedKey.getBytes(), "AES");
            Cipher cipher = Cipher.getInstance("AES");
            cipher.init(Cipher.DECRYPT_MODE, keySpec);
            byte[] decodedBytes  = Base64.getDecoder().decode(encryptedText);
            byte[] decryptedBytes = cipher.doFinal(decodedBytes );
            String decryptedBookid = new String(decryptedBytes);
            return decryptedBookid;
        } catch (Exception ex) {
            ex.printStackTrace();
            return null;
        }
    }
}
