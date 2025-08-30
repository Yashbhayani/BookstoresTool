package com.bookstore.bookstore.Repository;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;

import javax.crypto.BadPaddingException;
import javax.crypto.IllegalBlockSizeException;
import javax.crypto.NoSuchPaddingException;
import javax.crypto.SecretKey;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;

public interface AuthJwtRepository {
    public String generateToken(String username, String ipv4, String ipv6, String browser, String os, String device);
    public String getUsernameFromToken(String token);
    public String getIpv4FromToken(String token);
    public String getIpv6FromToken(String token);
    public String getBrowserFromToken(String token);
    public String getOsFromToken(String token);
    public String getDeviceFromToken(String token);
    public Jws<Claims> getClaims(String token);
    public boolean  isTokenValid(String token);
    public String IdEncrypt(long bookid) throws Exception;
    public String IdDecrypt(String bookid) throws NoSuchPaddingException, NoSuchAlgorithmException, InvalidKeyException, IllegalBlockSizeException, BadPaddingException;

}
