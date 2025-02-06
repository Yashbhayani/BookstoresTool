package com.bookstore.bookstore.Repository;

import java.util.Map;

public interface ReportRepository {
    Map<String, Object> dashboard(String Token);
    Map<String, Object> chart(String Token);
    Map<String, Object> fetchDetails(String Code,String Token);
    Map<String, Object> fetchSelectDetails(String Code, int id);
    boolean isUserAdmin(String Code);

}
