package com.bookstore.bookstore.Repository;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.util.Map;

import com.bookstore.bookstore.CustomModel.Model.User;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

public interface Userrepository {
    public String Hello();
    public void  serveUserImage(String imageName, String token, HttpServletRequest request, HttpServletResponse response) throws IOException;
    public Map<String, Object> Login(User user, HttpServletResponse responses);
    public Map<String, Object> Checkuser(String token);
    public Map<String, Object> logout(String token);
    public Map<String, Object> userinfo(String token);
    InputStream getuserimagespathResource(String fileName) throws FileNotFoundException;
    InputStream getdocumentimagespathResource(String fileName) throws FileNotFoundException;
    public Map<String, Object> checkPass(String checkPass);
    public  Map<String, Object> adminlist(String token, String report);
    public  Map<String, Object> useradminlist(String token, String report);
    public  Map<String, Object> applyuseradminlist(String token, String report);
    public  Map<String, Object> userlist(String token, String report);
    public  Map<String, Object> applyforUserAdmin(String token, String report);
    public  Map<String, Object> deActivate(String token, String uId);
    public  Map<String, Object> reActivate(String token, String uId);
    public  Map<String, Object> userProfile(String token, String uId);
    public  Map<String, Object> applyuserinfolist(String token, String uId);
    public  Map<String, Object> getuserinfolist(String token, String report);
    public  Map<String, Object> statusmanages(String token, String report);
}
