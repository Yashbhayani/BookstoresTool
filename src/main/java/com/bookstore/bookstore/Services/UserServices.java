package com.bookstore.bookstore.Services;

import com.bookstore.bookstore.CommonModel.CommonQueryServicesModel;
import com.bookstore.bookstore.CustomModel.Model.LoginModel;
import com.bookstore.bookstore.CustomModel.Model.User;
import com.bookstore.bookstore.Enum.ProjectCodes;
import com.bookstore.bookstore.Repository.AuthJwtRepository;
import com.bookstore.bookstore.Repository.Userrepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Service;

import java.io.*;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.*;


@Service
public class UserServices implements Userrepository {
    @Autowired
    private JdbcTemplate jdbcTemplate;
    private final AuthJwtRepository authjwtrepository;
    private  AuthJwt authJwt;
    @Value("${project.image}")
    private String path;
    public String SpResult = null;

    @Autowired
    private PasswordEncryptionService encryptionService;
    CommonQueryServicesModel commonQueryServicesModel = new CommonQueryServicesModel();

    public UserServices(AuthJwtRepository authjwtrepository) {
        this.authjwtrepository = authjwtrepository;
    }


    public String Hello() {
        return "Hello World!";
    }

    /*    public String insertUser(String FirstName, String LastName, String Email, String Password, MultipartFile Image) throws IOException {
            String query = "SELECT CASE WHEN COUNT(*) = 1 THEN 'True' ELSE 'False' END AS Result FROM usertable WHERE Email = ?";
            String result = jdbcTemplate.queryForObject(query, new Object[]{Email}, String.class);
            if ("False".equals(result)) {
                String name = Image.getOriginalFilename();
                String rendomId = UUID.randomUUID().toString();
                String FileRandomName = rendomId.concat(name.substring(name.lastIndexOf(".")));
                String FullPath = path + File.separator + FileRandomName;
                File f = new File(path);
                if (!f.exists()) {
                    f.mkdir();
                }
                Files.copy(Image.getInputStream(), Paths.get(FullPath));
                String newQuery = "INSERT INTO usertable (FirstName, LastName, Email, image, PassWord) VALUES (?, ?, ?, ?, ?)";
                jdbcTemplate.update(newQuery, FirstName, LastName, Email, FileRandomName, Password);
                return "User Added successfully";
            } else {
                return "Email Id is already added!";
            }
        }*/
    @Override
    public Map<String, Object> Login(User user) {
        String _hasPass = encryptionService.encrypt(user.getPassword());
        Map<String, Object> response = new HashMap<>();
        try {
            SpResult = jdbcTemplate.queryForObject(commonQueryServicesModel.SP, new Object[]{ProjectCodes.LoginCode.LOGINCODE.name()}, String.class);
            LoginModel loginResult = jdbcTemplate.queryForObject(SpResult, new Object[]{user.getEmail(), _hasPass}, new RowMapper<LoginModel>() {
                @Override
                public LoginModel mapRow(ResultSet rs, int rowNum) throws SQLException {
                    LoginModel loginModel = new LoginModel();
                    loginModel.setRole(rs.getString("Role"));
                    loginModel.setResult(rs.getString("Result"));
                    loginModel.setEmail(rs.getString("Email"));
                    return loginModel;
                }
            });
            if ("TRUE".equals(loginResult.getRole())) {
                if(Boolean.valueOf(loginResult.getResult())){
                    String token = authjwtrepository.generateToken(loginResult.getEmail());
                    response.put("token", token);
                    response.put("status", true);
                    response.put("Message", "Login is Successfully!");
                }else{
                    response.put("Message", "User is not valid!");
                    response.put("status", false);
                }
            } else {
                response.put("Message", "User is not valid!");
                response.put("status", false);
            }
            return response;
        } catch (EmptyResultDataAccessException e) {
            response.put("Message", e.getMessage());
            response.put("status", false);
            return response;
        }
    }

    @Override
    public Map<String, Object> Checkuser(String token) {
        Map<String, Object> response = new HashMap<>();
        try{
            if (authjwtrepository.isTokenValid(token)) {
                String username = authjwtrepository.getUsernameFromToken(token);

                SpResult = jdbcTemplate.queryForObject(commonQueryServicesModel.SP, new Object[]{ProjectCodes.ProjectSpCodes.CHECKUSERROLE.name()}, String.class);
                Map<String, Object> result = jdbcTemplate.queryForMap(SpResult, new Object[]{username});
                String userRoleResult = (String) result.get("Result");
                if (userRoleResult != null) {
                    boolean isAdmin = Boolean.parseBoolean(userRoleResult);
                    response.put("data", isAdmin);
                    response.put("Success", true);
                    response.put("Code", 200);
                }else{
                    response.put("Message", true);
                    response.put("Code", 200);
                }
            }
                else {
                    response.put("Message", "User is Not valid");
                    response.put("Success", false);
                }
            }
            catch (Exception e){
                response.put("Message", e.getMessage());
                response.put("Success", false);
            }
            return response;
    }

    @Override
    public InputStream getResource(String fileName) throws FileNotFoundException {
            String fullpath = path + File.separator + fileName;
            InputStream is = new FileInputStream(fullpath);
            return is;
    }

    @Override
    public Map<String, Object> checkPass(String checkPass) {
        String _pass = encryptionService.decrypt(checkPass);
        Map<String, Object> response = new HashMap<>();
        response.put("data", _pass);
        response.put("Success", true);
        response.put("Code", 200);
        return response;
    }

}
