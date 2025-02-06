package com.bookstore.bookstore.Services;

import com.bookstore.bookstore.CommonModel.CommonQueryServicesModel;
import com.bookstore.bookstore.EntityModels.IProductModel;
import com.bookstore.bookstore.Enum.ProjectCodes;
import com.bookstore.bookstore.CustomModel.ListModel.Product.ProductsModel;
import com.bookstore.bookstore.CustomModel.Model.ProductModel;
import com.bookstore.bookstore.Repository.AuthJwtRepository;
import com.bookstore.bookstore.Repository.ProductRepository;
import com.bookstore.bookstore.Repository.ReportRepository;
import com.bookstore.bookstore.SelectModel.ISelectModel;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.CallableStatementCallback;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Service;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.Statement;
import java.util.*;

@Service
public class ProductServices implements ProductRepository {

    @Autowired
    private JdbcTemplate jdbcTemplate;
    public String SpResult;
    private final AuthJwtRepository authjwtrepository;
    private final ReportRepository reportRepository;
    CommonQueryServicesModel commonQueryServicesModel = new CommonQueryServicesModel();
    public ProductServices(AuthJwtRepository authjwtrepository, ReportRepository reportRepository) {
        this.authjwtrepository = authjwtrepository;
        this.reportRepository = reportRepository;
    }

    @Override
    public Map<String, Object> getproduct(String Token, String report) {
        Map<String, Object> response = new HashMap<>();
        try {
            // Check if the token is valid
            if (!authjwtrepository.isTokenValid(Token)) {
                response.put("Message", "User is Not valid");
                response.put("Success", false);
                return response;
            }

            // Get username from the token
            String username = authjwtrepository.getUsernameFromToken(Token);

            if (!this.reportRepository.isUserAdmin(username)) {
                response.put("Message", "User is Not valid");
                response.put("Success", false);
                return response;
            }

            Map<String, Object> productResponse = this.reportRepository.fetchDetails(ProjectCodes.ReportCods.ALLPRODUCTTYPES.name(),report);
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
    public Map<String, Object> getselectproductlist(String token) {
        Map<String, Object> response = new HashMap<>();
        try {

            if (!authjwtrepository.isTokenValid(token)) {
                response.put("Message", "User is Not valid");
                response.put("Success", false);
                return response;
            }

            // Get username from the token
            String username = authjwtrepository.getUsernameFromToken(token);

            if (!this.reportRepository.isUserAdmin(username)) {
                response.put("Message", "User is Not valid");
                response.put("Success", false);
                return response;
            }

            Map<String, Object> productResponse = this.reportRepository.fetchSelectDetails(ProjectCodes.SelectCodes.SELECTPRODUCT.name(), 0);
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
    public Map<String, Object> save(String Token, IProductModel iProductModel) {
        Map<String, Object> response = new HashMap<>();
        try {
            if (authjwtrepository.isTokenValid(Token)) {
                String username = authjwtrepository.getUsernameFromToken(Token);
                SpResult = jdbcTemplate.queryForObject(commonQueryServicesModel.SP, new Object[]{ProjectCodes.ProjectSpCodes.CHECKUSERROLE.name()}, String.class);
                Map<String, Object> result = jdbcTemplate.queryForMap(SpResult, new Object[]{username});
                String userRoleResult = (String) result.get("Result");
                if (userRoleResult != null) {
                    boolean isAdmin = Boolean.parseBoolean(userRoleResult);
                    if (isAdmin) {
                        KeyHolder keyHolder = new GeneratedKeyHolder();
                        jdbcTemplate.update(connection -> {
                            PreparedStatement ps = connection.prepareStatement(commonQueryServicesModel.ProductSaveQuery, Statement.RETURN_GENERATED_KEYS);
                            ps.setString(1, iProductModel.Code);
                            ps.setString(2, iProductModel.Name);
                            ps.setInt(3, iProductModel.isActive ? 1 : 0);
                            return ps;
                        }, keyHolder);
                        Long generatedId = keyHolder.getKey().longValue();

                        if(generatedId >= 1) {
                            response.put("Message", "Data Added!");
                            response.put("Success", true);
                        }else{
                            response.put("Message", "Data Not Added!");
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
            }else {
                    response.put("Message", "User is Not valid");
                    response.put("Success", false);
                }
        }catch (Exception e){
            response.put("Message", e.getMessage());
            response.put("Success", false);
        }
        return response;
    }

    @Override
    public Map<String, Object> update(String Token, IProductModel iProductModel) {
        Map<String, Object> response = new HashMap<>();
        try {
            if (authjwtrepository.isTokenValid(Token)) {
                String username = authjwtrepository.getUsernameFromToken(Token);
                SpResult = jdbcTemplate.queryForObject(commonQueryServicesModel.SP, new Object[]{ProjectCodes.ProjectSpCodes.CHECKUSERROLE.name()}, String.class);
                Map<String, Object> result = jdbcTemplate.queryForMap(SpResult, new Object[]{username});
                String userRoleResult = (String) result.get("Result");
                if (userRoleResult != null) {
                    boolean isAdmin = Boolean.parseBoolean(userRoleResult);
                    if (isAdmin) {
                        iProductModel.Pid = authjwtrepository.IdDecrypt(iProductModel.Pid);
                        int pid = Integer.parseInt(iProductModel.Pid);
                        KeyHolder keyHolder = new GeneratedKeyHolder();
                        long rowsAffected = jdbcTemplate.update(connection -> {
                            PreparedStatement ps = connection.prepareStatement(commonQueryServicesModel.ProductEditQuery, Statement.RETURN_GENERATED_KEYS);
                            //ps.setString(1, iProductModel.Code);
                            ps.setString(1, iProductModel.Name);
                            ps.setInt(2, iProductModel.isActive ? 1 : 0 );
                            ps.setInt(3, pid);
                            return ps;
                        }, keyHolder);

                        if(rowsAffected == 1) {
                            response.put("Message", "Data Updated!");
                            response.put("Success", true);
                        }else{
                            response.put("Message", "Data Not Updated!");
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
            }else {
                response.put("Message", "User is Not valid");
                response.put("Success", false);
            }
        }catch (Exception e){
            response.put("Message", e.getMessage());
            response.put("Success", false);
        }
        return response;
    }

    @Override
    public Map<String, Object> delete(String Token, String pId) {
        Map<String, Object> response = new HashMap<>();
        try {
            if (authjwtrepository.isTokenValid(Token)) {
                String username = authjwtrepository.getUsernameFromToken(Token);
                SpResult = jdbcTemplate.queryForObject(commonQueryServicesModel.SP, new Object[]{ProjectCodes.ProjectSpCodes.CHECKUSERROLE.name()}, String.class);
                Map<String, Object> result = jdbcTemplate.queryForMap(SpResult, new Object[]{username});
                String userRoleResult = (String) result.get("Result");
                if (userRoleResult != null) {
                    boolean isAdmin = Boolean.parseBoolean(userRoleResult);
                    if (isAdmin) {
                        int pid = Integer.parseInt(authjwtrepository.IdDecrypt(pId));
                        KeyHolder keyHolder = new GeneratedKeyHolder();
                        long rowsAffected = jdbcTemplate.update(connection -> {
                            PreparedStatement ps = connection.prepareStatement(commonQueryServicesModel.ProductDeleteQuery, Statement.RETURN_GENERATED_KEYS);
                            ps.setInt(1, 1);
                            ps.setInt(2, pid);
                            return ps;
                        }, keyHolder);
                        if(rowsAffected > 0) {
                            response.put("Message", "Data Deleted!");
                            response.put("Success", true);
                        }else{
                            response.put("Message", "Data Not Deleted!");
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
            }else {
                response.put("Message", "User is Not valid");
                response.put("Success", false);
            }
        }catch (Exception e){
            response.put("Message", e.getMessage());
            response.put("Success", false);
        }
        return response;
    }

    @Override
    public Map<String, Object> reStore(String Token, String pId) {
        Map<String, Object> response = new HashMap<>();
        try {
            if (authjwtrepository.isTokenValid(Token)) {
                String username = authjwtrepository.getUsernameFromToken(Token);
                SpResult = jdbcTemplate.queryForObject(commonQueryServicesModel.SP, new Object[]{ProjectCodes.ProjectSpCodes.CHECKUSERROLE.name()}, String.class);
                Map<String, Object> result = jdbcTemplate.queryForMap(SpResult, new Object[]{username});
                String userRoleResult = (String) result.get("Result");
                if (userRoleResult != null) {
                    boolean isAdmin = Boolean.parseBoolean(userRoleResult);
                    if (isAdmin) {
                        int pid = Integer.parseInt(authjwtrepository.IdDecrypt(pId));
                        KeyHolder keyHolder = new GeneratedKeyHolder();
                        long rowsAffected = jdbcTemplate.update(connection -> {
                            PreparedStatement ps = connection.prepareStatement(commonQueryServicesModel.ProductDeleteQuery, Statement.RETURN_GENERATED_KEYS);
                            ps.setInt(1, 0);
                            ps.setInt(2, pid);
                            return ps;
                        }, keyHolder);
                        if(rowsAffected > 0) {
                            response.put("Message", "Data Restore!");
                            response.put("Success", true);
                        }else{
                            response.put("Message", "Data Not Restore!");
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
            }else {
                response.put("Message", "User is Not valid");
                response.put("Success", false);
            }
        }catch (Exception e){
            response.put("Message", e.getMessage());
            response.put("Success", false);
        }
        return response;
    }

    @Override
    public Map<String, Object> reActivate(String Token, String pId) {
        Map<String, Object> response = new HashMap<>();
        try {
            if (authjwtrepository.isTokenValid(Token)) {
                String username = authjwtrepository.getUsernameFromToken(Token);
                SpResult = jdbcTemplate.queryForObject(commonQueryServicesModel.SP, new Object[]{ProjectCodes.ProjectSpCodes.CHECKUSERROLE.name()}, String.class);
                Map<String, Object> result = jdbcTemplate.queryForMap(SpResult, new Object[]{username});
                String userRoleResult = (String) result.get("Result");
                if (userRoleResult != null) {
                    boolean isAdmin = Boolean.parseBoolean(userRoleResult);
                    if (isAdmin) {
                        int pid = Integer.parseInt(authjwtrepository.IdDecrypt(pId));
                        KeyHolder keyHolder = new GeneratedKeyHolder();
                        long rowsAffected = jdbcTemplate.update(connection -> {
                            PreparedStatement ps = connection.prepareStatement(commonQueryServicesModel.ProductIsActiveQuery, Statement.RETURN_GENERATED_KEYS);
                            ps.setInt(1, 1);
                            ps.setInt(2, pid);
                            return ps;
                        }, keyHolder);
                        if(rowsAffected > 0) {
                            response.put("Message", "Data Activated!");
                            response.put("Success", true);
                        }else{
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
            }else {
                response.put("Message", "User is Not valid");
                response.put("Success", false);
            }
        }catch (Exception e){
            response.put("Message", e.getMessage());
            response.put("Success", false);
        }
        return response;
    }

    @Override
    public Map<String, Object> deActivate (String Token, String pId) {
        Map<String, Object> response = new HashMap<>();
        try {
            if (authjwtrepository.isTokenValid(Token)) {
                String username = authjwtrepository.getUsernameFromToken(Token);
                SpResult = jdbcTemplate.queryForObject(commonQueryServicesModel.SP, new Object[]{ProjectCodes.ProjectSpCodes.CHECKUSERROLE.name()}, String.class);
                Map<String, Object> result = jdbcTemplate.queryForMap(SpResult, new Object[]{username});
                String userRoleResult = (String) result.get("Result");
                if (userRoleResult != null) {
                    boolean isAdmin = Boolean.parseBoolean(userRoleResult);
                    if (isAdmin) {
                        int pid = Integer.parseInt(authjwtrepository.IdDecrypt(pId));
                        KeyHolder keyHolder = new GeneratedKeyHolder();
                        long rowsAffected = jdbcTemplate.update(connection -> {
                            PreparedStatement ps = connection.prepareStatement(commonQueryServicesModel.ProductIsActiveQuery, Statement.RETURN_GENERATED_KEYS);
                            ps.setInt(1, 0);
                            ps.setInt(2, pid);
                            return ps;
                        }, keyHolder);
                        if(rowsAffected > 0) {
                            response.put("Message", "Data DeActivated!");
                            response.put("Success", true);
                        }else{
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
            }else {
                response.put("Message", "User is Not valid");
                response.put("Success", false);
            }
        }catch (Exception e){
            response.put("Message", e.getMessage());
            response.put("Success", false);
        }
        return response;
    }

    @Override
    public Map<String, Object> getProductDetails(String Token, String pId) {
        Map<String, Object> response = new HashMap<>();
        try {
            if (authjwtrepository.isTokenValid(Token)) {
                String username = authjwtrepository.getUsernameFromToken(Token);
                SpResult = jdbcTemplate.queryForObject(commonQueryServicesModel.SP, new Object[]{ProjectCodes.ProjectSpCodes.CHECKUSERROLE.name()}, String.class);
                Map<String, Object> result = jdbcTemplate.queryForMap(SpResult, new Object[]{username});
                String userRoleResult = (String) result.get("Result");
                if (userRoleResult != null) {
                    boolean isAdmin = Boolean.parseBoolean(userRoleResult);
                    int pid = Integer.parseInt(authjwtrepository.IdDecrypt(pId));

                    if (isAdmin) {
                        SpResult = jdbcTemplate.queryForObject(commonQueryServicesModel.SP, new Object[]{ProjectCodes.ProjectSpCodes.GETPRODUCT.name()}, String.class);
                        var Product_Model = jdbcTemplate.execute(
                                SpResult,
                                (CallableStatementCallback<ProductModel>) callableStatement -> {
                                    callableStatement.setInt(1, pid);
                                    boolean hasResults = callableStatement.execute();
                                    ProductModel productModel = new ProductModel();

                                    if (hasResults) {
                                        try (ResultSet rs = callableStatement.getResultSet()) {
                                            while (rs != null && rs.next()) {
                                                productModel.setPid(pId);
                                                productModel.setName(rs.getString("Name"));
                                                productModel.setActive(rs.getBoolean("IsActive"));
                                            }
                                        }
                                    }
                                    return productModel;
                                });
                        if (Product_Model != null ) {
                            response.put("data", Product_Model);
                            response.put("Success", true);
                        }else {
                            response.put("Message", "Product List not found for the specified language.");
                            response.put("Success", false);
                        }
                    } else {
                        response.put("Message", "User is not an admin.");
                        response.put("Success", false);
                    }
                } else {
                    response.put("Message", "User role not found.");
                    response.put("Success", false);
                }
            } else {
                response.put("Message", "Invalid token.");
                response.put("Success", false);
            }
        } catch (Exception e) {
            response.put("Message", e.getMessage());
            response.put("Success", false);
        }
        return response;
    }

    @Override
    public Map<String, Object> getproductcode(String Token, String Code) {
        Map<String, Object> response = new HashMap<>();
        try {
            if (authjwtrepository.isTokenValid(Token)) {
                String username = authjwtrepository.getUsernameFromToken(Token);
                SpResult = jdbcTemplate.queryForObject(commonQueryServicesModel.SP, new Object[]{ProjectCodes.ProjectSpCodes.CHECKUSERROLE.name()}, String.class);
                Map<String, Object> result = jdbcTemplate.queryForMap(SpResult, new Object[]{username});
                String userRoleResult = (String) result.get("Result");
                if (userRoleResult != null) {
                    boolean isAdmin = Boolean.parseBoolean(userRoleResult);
                    if (isAdmin) {
                        SpResult = jdbcTemplate.queryForObject(commonQueryServicesModel.SP, new Object[]{ProjectCodes.ProjectSpCodes.VERIFYPRODUCTCODE.name()}, String.class);
                        boolean productCode = Boolean.TRUE.equals(jdbcTemplate.execute(SpResult, (CallableStatementCallback<Boolean>) callableStatement -> {
                            callableStatement.setString(1, Code);
                            boolean hasResults = callableStatement.execute();
                            if (hasResults) {
                                try (ResultSet rs = callableStatement.getResultSet()) {
                                    if (rs != null && rs.next()) {
                                        return rs.getBoolean("VerifyCode");
                                    }
                                }
                            }
                            return false;
                        }));

                        response.put("data", productCode);
                        response.put("Success", true);
                        response.put("Code", 200);
                    } else {
                        response.put("Message", "User is Not valid");
                        response.put("Success", false);
                    }
                } else {
                    response.put("Message", "User is Not valid");
                    response.put("Success", false);
                }
            }else {
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
}



