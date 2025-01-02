package com.bookstore.bookstore.Repository;

import java.io.FileNotFoundException;
import java.io.InputStream;
import java.util.Map;

import com.bookstore.bookstore.CustomModel.Model.User;

public interface Userrepository {
    public String Hello();
    public Map<String, Object> Login(User user);
    public Map<String, Object> Checkuser(String token);
    InputStream getResource(String fileName) throws FileNotFoundException;
    public Map<String, Object> checkPass(String checkPass);
}
