package com.bookstore.bookstore.Repository;

import jakarta.servlet.http.HttpServletResponse;

import javax.crypto.BadPaddingException;
import javax.crypto.IllegalBlockSizeException;
import javax.crypto.NoSuchPaddingException;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.util.Map;

public interface ReportRepository {
    Map<String, Object> dashboard(String Token);
    Map<String, Object> chart(String Token);
    Map<String, Object> fetchDetails(String Code,String Token);
    Map<String, Object> fetchDeta(String Code,String Token);
    Map<String, Object> fetchSelectDetails(String Code, int id);
    Map<String, Object> fetchListData(String Code, int id);
    boolean isUserAdmin(String Code);
    Map<String, Object> getdatafromJsonOb(String json) throws NoSuchPaddingException, IllegalBlockSizeException, NoSuchAlgorithmException, BadPaddingException, InvalidKeyException;
}
