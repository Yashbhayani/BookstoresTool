package com.bookstore.bookstore.Services;

import com.bookstore.bookstore.CommonModel.CommonQueryServicesModel;
import com.bookstore.bookstore.CustomModel.Model.LoginModel;
import com.bookstore.bookstore.CustomModel.Model.User;
import com.bookstore.bookstore.Enum.ProjectCodes;
import com.bookstore.bookstore.Repository.AuthJwtRepository;
import com.bookstore.bookstore.Repository.ReportRepository;
import com.bookstore.bookstore.Repository.Userrepository;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.MediaType;
import org.springframework.util.StreamUtils;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Service;

import java.io.*;
import java.security.PublicKey;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.*;


@Service
public class UserServices implements Userrepository {
    @Autowired
    private JdbcTemplate jdbcTemplate;
    private final AuthJwtRepository authjwtrepository;
    private final ReportRepository reportRepository;

    private AuthJwt authJwt;

    @Value("${project.user.images}")
    private String userimagespath;

    public String SpResult = null;

    @Value("${project.documentations}")
    private String documentimagespath;

    @Autowired
    private PasswordEncryptionService encryptionService;
    CommonQueryServicesModel commonQueryServicesModel = new CommonQueryServicesModel();

    public UserServices(AuthJwtRepository authjwtrepository,
                        ReportRepository reportRepository) {
        this.authjwtrepository = authjwtrepository;
        this.reportRepository = reportRepository;
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
    public Map<String, Object> Login(User user, HttpServletResponse responses) {
        String _hasPass = encryptionService.encrypt(user.getPassword());
        Map<String, Object> response = new HashMap<>();
        try {
            SpResult = jdbcTemplate.queryForObject(commonQueryServicesModel.SP, new Object[]{ProjectCodes.LoginCode.logincode.name().toUpperCase()}, String.class);
            LoginModel loginResult = jdbcTemplate.queryForObject(Objects.requireNonNull(SpResult), new Object[]{
                    user.getEmail(),                  // p_Email
                    _hasPass,                         // p_Password (encrypted)
                    user.getIp4address(),             // p_Ipv4
                    user.getIp6address(),             // p_Ipv6
                    user.getBrowser(),                // p_Browser
                    user.getOs(),                     // p_Os
                    user.getDeviceType(),             // p_DeviceType
                    user.getStatus(),                 // p_Status
                    user.getCountry(),                // p_Country
                    user.getCountryCode(),            // p_CountryCode
                    user.getRegion(),                 // p_Region
                    user.getRegionName(),             // p_RegionName
                    user.getCity(),                   // p_City
                    user.getZip(),                    // p_Zip
                    user.getLat(),                    // p_Lat
                    user.getLon(),                    // p_Lon
                    user.getTimezone(),               // p_Timezone
                    user.getIsp(),                    // p_Isp
                    user.getOrg(),                    // p_Org
                    user.getAsn(),                    // p_Asn
                    user.getQuery()
            }, new RowMapper<LoginModel>() {
                @Override
                public LoginModel mapRow(ResultSet rs, int rowNum) throws SQLException {
                    LoginModel loginModel = new LoginModel();
                    loginModel.setRole(rs.getString("Role"));
                    loginModel.setResult(rs.getString("Result"));
                    loginModel.setEmail(rs.getString("Email"));
                    return loginModel;
                }
            });
            if ("TRUE".equals(Objects.requireNonNull(loginResult).getRole())) {
                if (Boolean.parseBoolean(loginResult.getResult())) {
                    String token = authjwtrepository.generateToken(
                            loginResult.getEmail(), user.getIp4address(),
                            user.getIp6address(), user.getBrowser(),
                            user.getOs(), user.getDeviceType());
                    Cookie cookie = new Cookie("access_token", token);
                    cookie.setHttpOnly(true);
                    cookie.setSecure(true);
                    cookie.setPath("/");
                    responses.addCookie(cookie);

                    response.put("token", token);
                    response.put("status", true);
                    response.put("Message", "Login is Successfully!");
                } else {
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
        try {
            if (authjwtrepository.isTokenValid(token)) {
                String username = authjwtrepository.getUsernameFromToken(token);
                SpResult = jdbcTemplate.queryForObject(commonQueryServicesModel.SP, new Object[]{ProjectCodes.ProjectSpCodes.checkuserrole.name().toUpperCase()}, String.class);
                Map<String, Object> result = jdbcTemplate.queryForMap(Objects.requireNonNull(SpResult), new Object[]{username});
                String userRoleResult = (String) result.get("Result");
                if (userRoleResult != null) {
                    boolean isAdmin = Boolean.parseBoolean(userRoleResult);
                    response.put("data", isAdmin);
                    response.put("Success", true);
                    response.put("Code", 200);
                } else {
                    response.put("Message", true);
                    response.put("Code", 200);
                }
            } else {
                response.put("Message", "User is Not valid");
                response.put("Success", false);
            }
        } catch (Exception e) {
            response.put("Message", e.getMessage());
            response.put("Success", false);
        }
        return response;
    }

    @Override
    public Map<String, Object> logout(String token) {
        Map<String, Object> response = new HashMap<>();
        try {
            if (authjwtrepository.isTokenValid(token)) {
                String Email = authjwtrepository.getUsernameFromToken(token);
                String Ipv4 = authjwtrepository.getIpv4FromToken(token);
                String IPv6 = authjwtrepository.getIpv6FromToken(token);
                String Browser = authjwtrepository.getBrowserFromToken(token);
                String Device = authjwtrepository.getDeviceFromToken(token);
                String Os = authjwtrepository.getOsFromToken(token);
                SpResult = jdbcTemplate.queryForObject(commonQueryServicesModel.SP, new Object[]{ProjectCodes.LoginCode.logout.name().toUpperCase()}, String.class);
                Map<String, Object> result = jdbcTemplate.queryForMap(Objects.requireNonNull(SpResult), new Object[]{
                        Email, Ipv4, IPv6, Browser, Os, Device
                });
                Boolean Resu = (Boolean) result.get("success");
                System.out.println(Resu);
                response.put("Message", Resu ? "User logged out successfully" : "Logout failed");
                response.put("Success", Resu);
            } else {
                response.put("Message", "User is Not valid");
                response.put("Success", false);
            }
        } catch (Exception e) {
            response.put("Message", e.getMessage());
            response.put("Success", false);
        }
        return response;
    }

    @Override
    public Map<String, Object> userinfo(String token) {
        return Map.of();
    }

    @Override
    public InputStream getuserimagespathResource(String fileName) throws FileNotFoundException {
        String fullpath = userimagespath + File.separator + fileName;
        InputStream is = new FileInputStream(fullpath);
        return is;
    }

    @Override
    public InputStream getdocumentimagespathResource(String fileName) throws FileNotFoundException {
        String fullpath = documentimagespath + File.separator + fileName;
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


    @Override
    public Map<String, Object> adminlist(String token, String report) {
        Map<String, Object> response = new HashMap<>();
        try {
            if (!authjwtrepository.isTokenValid(token)) {
                response.put("Message", "User is Not valid");
                response.put("Success", false);
                return response;
            }

            String username = authjwtrepository.getUsernameFromToken(token);

            if (!this.reportRepository.isUserAdmin(username)) {
                response.put("Message", "User is Not valid");
                response.put("Success", false);
                return response;
            }

            Map<String, Object> productResponse = this.reportRepository.fetchDetails(ProjectCodes.ReportCods.adminlist.name().toUpperCase(), report);
            if (productResponse.containsKey("Success") && (boolean) productResponse.get("Success")) {
                response.put("data", productResponse.get("data"));
                response.put("Success", true);
                response.put("Code", 200);
            } else {
                response.put("Message", productResponse.get("Message"));
                response.put("Success", false);
            }


        } catch (Exception e) {
            response.put("Message", e.getMessage());
            response.put("Success", false);
        }
        return response;
    }

    @Override
    public Map<String, Object> useradminlist(String token, String report) {
        Map<String, Object> response = new HashMap<>();
        try {
            if (!authjwtrepository.isTokenValid(token)) {
                response.put("Message", "User is Not valid");
                response.put("Success", false);
                return response;
            }

            String username = authjwtrepository.getUsernameFromToken(token);

            if (!this.reportRepository.isUserAdmin(username)) {
                response.put("Message", "User is Not valid");
                response.put("Success", false);
                return response;
            }

            Map<String, Object> productResponse = this.reportRepository.fetchDetails(ProjectCodes.ReportCods.useradminlist.name().toUpperCase(), report);
            if (productResponse.containsKey("Success") && (boolean) productResponse.get("Success")) {
                response.put("data", productResponse.get("data"));
                response.put("Success", true);
                response.put("Code", 200);
            } else {
                response.put("Message", productResponse.get("Message"));
                response.put("Success", false);
            }
        } catch (Exception e) {
            response.put("Message", e.getMessage());
            response.put("Success", false);
        }
        return response;
    }


    @Override
    public Map<String, Object> applyuserinfolist(String token, String Uid) {
        Map<String, Object> response = new HashMap<>();
        try {
            if (!authjwtrepository.isTokenValid(token)) {
                response.put("Message", "User is Not valid");
                response.put("Success", false);
                return response;
            }

            String username = authjwtrepository.getUsernameFromToken(token);

            if (!this.reportRepository.isUserAdmin(username)) {
                response.put("Message", "User is Not valid");
                response.put("Success", false);
                return response;
            }
            int uid = Integer.parseInt(authjwtrepository.IdDecrypt(Uid));
            Map<String, Object> productResponse = this.reportRepository.fetchListData(ProjectCodes.ReportCods.applyuseradmininfolist.name().toUpperCase(), uid);
            if (productResponse.containsKey("Success") && (boolean) productResponse.get("Success")) {
                response.put("data", productResponse.get("data"));
                response.put("Success", true);
                response.put("Code", 200);
            } else {
                response.put("Message", productResponse.get("Message"));
                response.put("Success", false);
            }
        } catch (Exception e) {
            response.put("Message", e.getMessage());
            response.put("Success", false);
        }
        return response;
    }

    @Override
    public Map<String, Object> getuserinfolist(String token, String report) {
        Map<String, Object> response = new HashMap<>();
        try {
            if (!authjwtrepository.isTokenValid(token)) {
                response.put("Message", "User is Not valid");
                response.put("Success", false);
                return response;
            }

            String username = authjwtrepository.getUsernameFromToken(token);

            if (!this.reportRepository.isUserAdmin(username)) {
                response.put("Message", "User is Not valid");
                response.put("Success", false);
                return response;
            }

            // Step 1: Call your existing method
            Map<String, Object> result = this.reportRepository.getdatafromJsonOb(report);

            // Step 2: Check if decryption/parsing was successful
            boolean isSuccess = (boolean) result.get("Success");
            if (!isSuccess) {
                response.put("Success", false);
                response.put("Message", result.get("Message"));
            } else {
                ObjectMapper mapper = new ObjectMapper();
                String reportJson = mapper.writeValueAsString(result.get("data"));
                Map<String, Object> productResponse = this.reportRepository.fetchDeta(ProjectCodes.ReportCods.getuserinfo.name().toUpperCase(), reportJson);
                if (productResponse.containsKey("Success") && (boolean) productResponse.get("Success")) {
                    response.put("data", productResponse.get("data"));
                    response.put("Success", true);
                    response.put("Code", 200);
                } else {
                    response.put("Message", productResponse.get("Message"));
                    response.put("Success", false);
                }
            }
        } catch (Exception e) {
            response.put("Message", e.getMessage());
            response.put("Success", false);
        }
        return response;
    }

    @Override
    public Map<String, Object> statusmanages(String token, String report) {
        Map<String, Object> response = new HashMap<>();
        try {

        } catch (Exception e) {
            response.put("Message", e.getMessage());
            response.put("Success", false);
        }
        return response;
    }

    @Override
    public Map<String, Object> applyuseradminlist(String token, String report) {
        Map<String, Object> response = new HashMap<>();
        try {
            if (!authjwtrepository.isTokenValid(token)) {
                response.put("Message", "User is Not valid");
                response.put("Success", false);
                return response;
            }

            String username = authjwtrepository.getUsernameFromToken(token);

            if (!this.reportRepository.isUserAdmin(username)) {
                response.put("Message", "User is Not valid");
                response.put("Success", false);
                return response;
            }

            Map<String, Object> productResponse = this.reportRepository.fetchDetails(ProjectCodes.ReportCods.applyuseradminlist.name().toUpperCase(), report);
            if (productResponse.containsKey("Success") && (boolean) productResponse.get("Success")) {
                response.put("data", productResponse.get("data"));
                response.put("Success", true);
                response.put("Code", 200);
            } else {
                response.put("Message", productResponse.get("Message"));
                response.put("Success", false);
            }

        } catch (Exception e) {
            response.put("Message", e.getMessage());
            response.put("Success", false);
        }
        return response;

    }

    @Override
    public Map<String, Object> userlist(String token, String report) {
        Map<String, Object> response = new HashMap<>();
        try {
            if (!authjwtrepository.isTokenValid(token)) {
                response.put("Message", "User is Not valid");
                response.put("Success", false);
                return response;
            }

            String username = authjwtrepository.getUsernameFromToken(token);

            if (!this.reportRepository.isUserAdmin(username)) {
                response.put("Message", "User is Not valid");
                response.put("Success", false);
                return response;
            }

            Map<String, Object> productResponse = this.reportRepository.fetchDetails(ProjectCodes.ReportCods.userlist.name().toUpperCase(), report);
            if (productResponse.containsKey("Success") && (boolean) productResponse.get("Success")) {
                response.put("data", productResponse.get("data"));
                response.put("Success", true);
                response.put("Code", 200);
            } else {
                response.put("Message", productResponse.get("Message"));
                response.put("Success", false);
            }


        } catch (Exception e) {
            response.put("Message", e.getMessage());
            response.put("Success", false);
        }
        return response;
    }

    @Override
    public Map<String, Object> applyforUserAdmin(String token, String report) {
        Map<String, Object> response = new HashMap<>();
        try {
            if (!authjwtrepository.isTokenValid(token)) {
                response.put("Message", "User is Not valid");
                response.put("Success", false);
                return response;
            }

            String username = authjwtrepository.getUsernameFromToken(token);

            if (!this.reportRepository.isUserAdmin(username)) {
                response.put("Message", "User is Not valid");
                response.put("Success", false);
                return response;
            }

            Map<String, Object> productResponse = this.reportRepository.fetchDetails(ProjectCodes.ReportCods.getapplyuseradminlist.name().toUpperCase(), report);
            if (productResponse.containsKey("Success") && (boolean) productResponse.get("Success")) {
                response.put("data", productResponse.get("data"));
                response.put("Success", true);
                response.put("Code", 200);
            } else {
                response.put("Message", productResponse.get("Message"));
                response.put("Success", false);
            }


        } catch (Exception e) {
            response.put("Message", e.getMessage());
            response.put("Success", false);
        }
        return response;
    }


    @Override
    public Map<String, Object> deActivate(String token, String uID) {
        Map<String, Object> response = new HashMap<>();
        try {

            if (authjwtrepository.isTokenValid(token)) {
                String username = authjwtrepository.getUsernameFromToken(token);
                SpResult = jdbcTemplate.queryForObject(commonQueryServicesModel.SP, new Object[]{ProjectCodes.ProjectSpCodes.checkuserrole.name().toUpperCase()}, String.class);
                Map<String, Object> result = jdbcTemplate.queryForMap(SpResult, new Object[]{username});
                String userRoleResult = (String) result.get("Result");
                if (userRoleResult != null) {
                    boolean isAdmin = Boolean.parseBoolean(userRoleResult);
                    if (isAdmin) {
                        int uid = Integer.parseInt(authjwtrepository.IdDecrypt(uID));
                        KeyHolder keyHolder = new GeneratedKeyHolder();
                        long rowsAffected = jdbcTemplate.update(connection -> {
                            PreparedStatement ps = connection.prepareStatement(commonQueryServicesModel.UserIsActiveQuery, Statement.RETURN_GENERATED_KEYS);
                            ps.setInt(1, 0);
                            ps.setInt(2, 1);
                            ps.setInt(3, uid);
                            return ps;
                        }, keyHolder);
                        if (rowsAffected > 0) {
                            response.put("Message", "Data DeActivated!");
                            response.put("Success", true);
                        } else {
                            response.put("Message", "Data Not DeActive!");
                            response.put("Success", false);
                        }
                    } else {
                        response.put("Message", "User is Not valid");
                        response.put("Success", false);
                    }
                } else {
                    response.put("Message", "User is Not valid");
                    response.put("Success", false);
                }

            } else {
                response.put("Message", "User is Not valid");
                response.put("Success", false);
            }
        } catch (Exception e) {
            response.put("Message", e.getMessage());
            response.put("Success", false);
        }
        return response;
    }


    @Override
    public Map<String, Object> reActivate(String token, String uID) {
        Map<String, Object> response = new HashMap<>();
        try {

            if (authjwtrepository.isTokenValid(token)) {
                String username = authjwtrepository.getUsernameFromToken(token);
                SpResult = jdbcTemplate.queryForObject(commonQueryServicesModel.SP, new Object[]{ProjectCodes.ProjectSpCodes.checkuserrole.name().toUpperCase()}, String.class);
                Map<String, Object> result = jdbcTemplate.queryForMap(SpResult, new Object[]{username});
                String userRoleResult = (String) result.get("Result");
                if (userRoleResult != null) {
                    boolean isAdmin = Boolean.parseBoolean(userRoleResult);
                    if (isAdmin) {
                        int uid = Integer.parseInt(authjwtrepository.IdDecrypt(uID));
                        KeyHolder keyHolder = new GeneratedKeyHolder();
                        long rowsAffected = jdbcTemplate.update(connection -> {
                            PreparedStatement ps = connection.prepareStatement(commonQueryServicesModel.UserIsActiveQuery, Statement.RETURN_GENERATED_KEYS);
                            ps.setInt(1, 1);
                            ps.setInt(2, 0);
                            ps.setInt(3, uid);
                            return ps;
                        }, keyHolder);
                        if (rowsAffected > 0) {
                            response.put("Message", "Data Activated!");
                            response.put("Success", true);
                        } else {
                            response.put("Message", "Data Not Activated!");
                            response.put("Success", false);
                        }
                    } else {
                        response.put("Message", "User is Not valid");
                        response.put("Success", false);
                    }
                } else {
                    response.put("Message", "User is Not valid");
                    response.put("Success", false);
                }

            } else {
                response.put("Message", "User is Not valid");
                response.put("Success", false);
            }
        } catch (Exception e) {
            response.put("Message", e.getMessage());
            response.put("Success", false);
        }
        return response;
    }


    @Override
    public Map<String, Object> userProfile(String token, String uID) {
        Map<String, Object> response = new HashMap<>();

        try {
            if (!authjwtrepository.isTokenValid(token)) {
                response.put("Message", "User is Not valid");
                response.put("Success", false);
                return response;
            }

            String username = authjwtrepository.getUsernameFromToken(token);

            if (!this.reportRepository.isUserAdmin(username)) {
                response.put("Message", "User is Not valid");
                response.put("Success", false);
                return response;
            }

        } catch (Exception e) {
            response.put("Message", e.getMessage());
            response.put("Success", false);
        }
        return response;
    }

    @Override
    public void serveUserImage(String imageName, String token, HttpServletRequest request, HttpServletResponse response) throws IOException {
        String referer = request.getHeader("Referer");

        if (!authjwtrepository.isTokenValid(token) || !isValidReferer(referer)) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.setContentType("application/json");
            response.getWriter().write("{\"message\":\"Unauthorized access\",\"success\":false}");
            return;
        }

        InputStream resource = getuserimagespathResource(imageName);

        if (resource == null) {
            response.setStatus(HttpServletResponse.SC_NOT_FOUND);
            response.setContentType("application/json");
            response.getWriter().write("{\"message\":\"Image not found\",\"success\":false}");
            return;
        }

        String fileExtension = imageName.substring(imageName.lastIndexOf('.') + 1);
        String contentType;
        if ("jpeg".equalsIgnoreCase(fileExtension) || "jpg".equalsIgnoreCase(fileExtension)) {
            contentType = MediaType.IMAGE_JPEG_VALUE;
        } else if ("png".equalsIgnoreCase(fileExtension)) {
            contentType = MediaType.IMAGE_PNG_VALUE;
        } else {
            contentType = MediaType.APPLICATION_OCTET_STREAM_VALUE;
        }

        response.setContentType(contentType);
        StreamUtils.copy(resource, response.getOutputStream());
    }

    private boolean isValidReferer(String referer) {
        return referer != null && referer.startsWith("https://yourdomain.com");
    }
}
