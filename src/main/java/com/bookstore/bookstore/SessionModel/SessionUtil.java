package com.bookstore.bookstore.SessionModel;

import jakarta.servlet.http.HttpSession;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

@Component   // ✅ correct
public class SessionUtil {
    private final HttpSession session;

    public SessionUtil(HttpSession session) {
        this.session = session;
    }

    public void setUserToken(String token) {
        session.setAttribute("token", token);
    }

    public String getUserToken() {
        return (String) session.getAttribute("token");
    }
}
