package com.bookstore.bookstore.Repository;

import java.util.Map;

public interface ReportRepository {
    Map<String, Object> dashboard(String Token);
    Map<String, Object> chart(String Token);

}
