package com.bookstore.bookstore.Controller;

import java.io.IOException;
import java.io.InputStream;
import java.util.Map;

import com.bookstore.bookstore.SessionModel.SessionUtil;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.MediaType;
import org.springframework.util.StreamUtils;
import org.springframework.web.bind.annotation.*;

import com.bookstore.bookstore.CustomModel.Model.User;
import com.bookstore.bookstore.Repository.AuthJwtRepository;
import com.bookstore.bookstore.Repository.Userrepository;

@ComponentScan(basePackages = "com.bookstore.bookstore.Services")
@Configuration
@RestController
@RequestMapping("api")
public class UserController {
    private final Logger logger = LoggerFactory.getLogger(this.getClass());

    @Autowired
    private final Userrepository userrepository;

    public UserController(Userrepository userrepository) {
        this.userrepository = userrepository;
    }

    @GetMapping("/hello")
    public String index() {
        return userrepository.Hello();
    }

    @GetMapping(value = "/userimage/{imagename}")
    public void userImage(@PathVariable("imagename") String imageName,
                          /*@RequestParam String token,
                          HttpServletRequest request,*/
                          HttpServletResponse response) throws IOException {

     String referer = response.getHeader("Referer");

        InputStream resource = userrepository.getuserimagespathResource(imageName);
        String fileExtension = imageName.substring(imageName.lastIndexOf('.') + 1);
        String contentType;
        if ("jpeg".equalsIgnoreCase(fileExtension) || "jpg".equalsIgnoreCase(fileExtension)) {
            contentType = MediaType.IMAGE_JPEG_VALUE;
        } else if ("png".equalsIgnoreCase(fileExtension)) {
            contentType = MediaType.IMAGE_PNG_VALUE;
        } else {
            contentType = MediaType.IMAGE_JPEG_VALUE;
        }
        response.setContentType(contentType);
        StreamUtils.copy(resource, response.getOutputStream());
        // userrepository.serveUserImage(imageName, token, request, response);

    }

    @GetMapping(value = "/userdocument/{imagename}")
    public void userdocumentImage(@PathVariable("imagename") String imageName,
                          /*@RequestParam String token,
                          HttpServletRequest request,*/
                          HttpServletResponse response) throws IOException {

        String referer = response.getHeader("Referer");

        InputStream resource = userrepository.getdocumentimagespathResource(imageName);
        String fileExtension = imageName.substring(imageName.lastIndexOf('.') + 1);
        String contentType;
        if ("jpeg".equalsIgnoreCase(fileExtension) || "jpg".equalsIgnoreCase(fileExtension)) {
            contentType = MediaType.IMAGE_JPEG_VALUE;
        } else if ("png".equalsIgnoreCase(fileExtension)) {
            contentType = MediaType.IMAGE_PNG_VALUE;
        } else {
            contentType = MediaType.IMAGE_JPEG_VALUE;
        }
        response.setContentType(contentType);
        StreamUtils.copy(resource, response.getOutputStream());
        // userrepository.serveUserImage(imageName, token, request, response);

    }

    @PostMapping("/login")
    public Map<String, Object> login(@RequestBody User user, HttpServletResponse responses) {
        return userrepository.Login(user, responses);
    }

    @PutMapping("/logout")
    public  Map<String, Object> logout(@CookieValue(value = "access_token", required = false)  String token){
        return userrepository.logout(token);
    }

    @GetMapping("/checkuser")
    public Map<String, Object> checkuser(
            @CookieValue(value = "access_token", required = false)   String Token
    ) {
        return userrepository.Checkuser(Token);
    }

    @GetMapping(value = "/checkPass/{pass}")
    public Map<String, Object> checkPass(@RequestBody String pass) {
        return userrepository.checkPass(pass);
    }

    @GetMapping(value = "/userinfo")
    public Map<String, Object> userinfo(@CookieValue(value = "access_token", required = false) String Token) {
        return userrepository.userinfo(Token);
    }


    @GetMapping("/admin/list")
    public Map<String, Object> adminlist(
            @CookieValue(value = "access_token", required = false)   String token,
            @RequestParam("report") String report
    ) {
        return userrepository.adminlist(token, report);
    }

    @GetMapping("/useradmin/list")
    public Map<String, Object> useradminlist(
            @CookieValue(value = "access_token", required = false)   String token,
            @RequestParam("report") String report
    ) {
        return userrepository.useradminlist(token, report);
    }

    @GetMapping("apply/useradmin/list")
    public Map<String, Object> applyuseradminlist(
            @CookieValue(value = "access_token", required = false)   String token,
            @RequestParam("report") String report
    ) {
        return userrepository.applyuseradminlist(token, report);
    }

    @GetMapping("/user/list")
    public Map<String, Object> userlist(
            @CookieValue(value = "access_token", required = false)   String token,
            @RequestParam("report") String report
    ) {
        return userrepository.userlist(token, report);
    }

    @GetMapping("/user/request-for-user-admin")
    public Map<String, Object> applyforUserAdmin(
            @CookieValue(value = "access_token", required = false)   String token,
            @RequestParam("report") String report
    ) {
        return userrepository.applyforUserAdmin(token, report);
    }

    @PutMapping("/user/deActivate")
    public Map<String, Object> deActivate(
            @CookieValue(value = "access_token", required = false)   String token,
            @RequestParam("uid") String uId
    ) {
        return userrepository.deActivate(token, uId);
    }

    @PutMapping("/user/active")
    public Map<String, Object> reActivate(
            @CookieValue(value = "access_token", required = false)   String token,
            @RequestParam("uid") String uId
    ) {
        return userrepository.reActivate(token, uId);
    }

    @GetMapping("/user/profiles")
    public Map<String, Object> userProfile(
            @CookieValue(value = "access_token", required = false)   String token,
            @RequestParam("uid") String uId
    ) {
        return userrepository.userProfile(token, uId);
    }

    @GetMapping("/apply/applyuser/infolist")
    public Map<String, Object> applyuserinfolist(
            @CookieValue(value = "access_token", required = false)   String token,
            @RequestParam("uid") String uId
    ) {
        return userrepository.applyuserinfolist(token, uId);
    }


    @GetMapping("/apply/applyuser/getuserinfo")
    public  Map<String, Object> getuserinfolist(
            @CookieValue(value = "access_token", required = false)   String token,
            @RequestParam("report") String report
    ){
        return userrepository.getuserinfolist(token,report);
    }

    @PostMapping("/status")
    public Map<String, Object> status(
            @CookieValue(value = "access_token", required = false)   String token,
            @RequestParam("report") String report
    ){
        return userrepository.getuserinfolist(token,report);
    }


}
