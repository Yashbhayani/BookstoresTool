package com.bookstore.bookstore.Services;

import com.bookstore.bookstore.CommonModel.CommonQueryServicesModel;
import com.bookstore.bookstore.CustomModel.ListModel.Category.CategoryTypesModel;
import com.bookstore.bookstore.CustomModel.ListModel.SubCategory.SubCategoryTypesModel;
import com.bookstore.bookstore.CustomModel.Model.CategoryTypeModel;
import com.bookstore.bookstore.CustomModel.Model.GetCategoryModel;
import com.bookstore.bookstore.CustomModel.Model.GetSubCategoryModel;
import com.bookstore.bookstore.CustomModel.Model.SubCategoryTypeModel;
import com.bookstore.bookstore.EntityModels.ISubCategoryModel;
import com.bookstore.bookstore.Enum.ProjectCodes;
import com.bookstore.bookstore.Repository.AuthJwtRepository;
import com.bookstore.bookstore.Repository.SubCategoryRepository;
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
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


@Service
public class SubCategoryServices implements SubCategoryRepository {
    @Autowired
    private JdbcTemplate jdbcTemplate;
    public String SpResult = null;
    private final AuthJwtRepository authjwtrepository;
    public SubCategoryServices(AuthJwtRepository authjwtrepository) {
        this.authjwtrepository = authjwtrepository;
    }
    CommonQueryServicesModel commonQueryServicesModel = new CommonQueryServicesModel();

    @Override
    public Map<String, Object> getSubCategory(String Token, String report) {
        Map<String, Object> response = new HashMap<>();
        try{
            if (authjwtrepository.isTokenValid(Token)) {
                String username = authjwtrepository.getUsernameFromToken(Token);
                SpResult = jdbcTemplate.queryForObject(commonQueryServicesModel.SP, new Object[]{ProjectCodes.ProjectSpCodes.CHECKUSERROLE.name()}, String.class);
                Map<String, Object> result = jdbcTemplate.queryForMap(SpResult, new Object[]{username});
                String userRoleResult = (String) result.get("Result");
                if (userRoleResult != null) {
                    boolean isAdmin = Boolean.parseBoolean(userRoleResult);
                    if (isAdmin) {
                        SpResult = jdbcTemplate.queryForObject(commonQueryServicesModel.SP, new Object[]{ProjectCodes.ReportCods.ALLSUBCATEGORYTYPES.name()}, String.class);
                        var subCategoryList = jdbcTemplate.execute(SpResult, (CallableStatementCallback<SubCategoryTypesModel>) callableStatement -> {
                                SubCategoryTypesModel subCategoryTypesModel = new SubCategoryTypesModel();
                                callableStatement.setString(1, report);
                                boolean hasResults = callableStatement.execute();
                                if (hasResults) {
                                    try (ResultSet rs = callableStatement.getResultSet()) {
                                        if (rs != null && rs.next()) {
                                            subCategoryTypesModel.setSubCategoryCount(rs.getInt("total_SubCategory"));
                                        }
                                    }

                                    // Second result set: product details
                                    if (callableStatement.getMoreResults()) {
                                        try (ResultSet rs = callableStatement.getResultSet()) {
                                            List<SubCategoryTypeModel> subCategoryTypeModels = new ArrayList<>();
                                            while (rs != null && rs.next()) {
                                                SubCategoryTypeModel subCategoryTypeModel = new SubCategoryTypeModel();
                                                try {
                                                    subCategoryTypeModel.setSubCategoryId(authjwtrepository.IdEncrypt(rs.getInt("SubCategoryID")));
                                                } catch (Exception e) {
                                                    throw new RuntimeException(e);
                                                }
                                                subCategoryTypeModel.setProductName(rs.getString("ProductName"));
                                                subCategoryTypeModel.setCategoryName(rs.getString("CategoryName"));
                                                //subCategoryTypeModel.setSubCategoryCode(rs.getString("SubCategoryCode"));
                                                subCategoryTypeModel.setSubCategoryPath(rs.getString("SubCategoryPath"));
                                                subCategoryTypeModel.setSubCategoryValue(rs.getString("SubCategoryValue"));
                                                subCategoryTypeModel.setActive(rs.getBoolean("IsActive"));
                                                subCategoryTypeModels.add(subCategoryTypeModel);
                                            }
                                            subCategoryTypesModel.setSubCategoryTypeModels(subCategoryTypeModels);
                                        }
                                    }
                                }
                                return subCategoryTypesModel;
                        });
                        if (subCategoryList != null ) {
                            response.put("data", subCategoryList);
                            response.put("Success", true);
                            response.put("Code", 200);
                        } else {
                            response.put("Message", "subCategoryList List not found for the specified language.");
                            response.put("Success", false);
                        }

                    }
                    else {
                        response.put("Message", "User is Not valid");
                        response.put("Success", false);
                    }

                }else {
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
    public Map<String, Object> getselectSubCategorylist(String token, int scid) {
        Map<String, Object> response = new HashMap<>();
        try {
            if (authjwtrepository.isTokenValid(token)) {
                String username = authjwtrepository.getUsernameFromToken(token);
                SpResult = jdbcTemplate.queryForObject(commonQueryServicesModel.SP,new Object[]{ProjectCodes.ProjectSpCodes.CHECKUSERROLE.name()}, String.class);
                Map<String, Object> result = jdbcTemplate.queryForMap(SpResult, new Object[]{username});
                String userRoleResult = (String) result.get("Result");
                if (userRoleResult != null) {
                    boolean isAdmin = Boolean.parseBoolean(userRoleResult);

                    if (isAdmin) {
                        SpResult = jdbcTemplate.queryForObject(commonQueryServicesModel.SP,new Object[]{ProjectCodes.SelectCodes.SELECTSUBCATEGORY.name()}, String.class);
                        // Execute stored procedure and fetch product list
                        var I_Select_Product_Model = jdbcTemplate.execute(
                                SpResult,
                                (CallableStatementCallback<List<ISelectModel>>) callableStatement -> {
                                    callableStatement.setInt(1, scid);
                                    List<ISelectModel> resultList = new ArrayList<>();
                                    boolean hasResults = callableStatement.execute();

                                    if (hasResults) {
                                        try (ResultSet rs = callableStatement.getResultSet()) {
                                            while (rs != null && rs.next()) {
                                                ISelectModel iSelectModel = new ISelectModel();
                                                iSelectModel.setId(rs.getInt("Id"));
                                                iSelectModel.setName(rs.getString("Value"));
                                                resultList.add(iSelectModel);
                                            }
                                        }
                                    }
                                    return resultList;
                                });
                        if (I_Select_Product_Model != null ) {
                            response.put("data", I_Select_Product_Model);
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
    public Map<String, Object> getSubCategoryCode(String Token, String Code) {
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
                        SpResult = jdbcTemplate.queryForObject(commonQueryServicesModel.SP, new Object[]{ProjectCodes.ProjectSpCodes.VERIFYSUBCATEGORYCODE.name()}, String.class);
                        boolean categoryCode = Boolean.TRUE.equals(jdbcTemplate.execute(SpResult, (CallableStatementCallback<Boolean>) callableStatement -> {
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

                        response.put("data", categoryCode);
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

    @Override
    public Map<String, Object> getSubCategoryPath(String Token, String Path) {
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
                        SpResult = jdbcTemplate.queryForObject(commonQueryServicesModel.SP, new Object[]{ProjectCodes.ProjectSpCodes.VERIFYSUBCATEGORYPATH.name()}, String.class);
                        boolean categoryPath = Boolean.TRUE.equals(jdbcTemplate.execute(SpResult, (CallableStatementCallback<Boolean>) callableStatement -> {
                            callableStatement.setString(1, Path);
                            boolean hasResults = callableStatement.execute();
                            if (hasResults) {
                                try (ResultSet rs = callableStatement.getResultSet()) {
                                    if (rs != null && rs.next()) {
                                        return rs.getBoolean("VerifyPath");
                                    }
                                }
                            }
                            return false;
                        }));

                        response.put("data", categoryPath);
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

    @Override
    public Map<String, Object> save(String Token, ISubCategoryModel iSubCategoryModel) {
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
                        SpResult = jdbcTemplate.queryForObject(commonQueryServicesModel.SP, new Object[]{ProjectCodes.ProjectSpCodes.PRODUCTSTATUS.name()}, String.class);
                        Map<String, Object> S_result = jdbcTemplate.queryForMap(SpResult, new Object[]{iSubCategoryModel.pID});
                        Long statusPResultLong = (Long) S_result.get("Status"); // Change to Long
                        if(statusPResultLong == 1 ? true : false){
                            SpResult = jdbcTemplate.queryForObject(commonQueryServicesModel.SP, new Object[]{ProjectCodes.ProjectSpCodes.CATEGORYSTATUS.name()}, String.class);
                            Map<String, Object> C_result = jdbcTemplate.queryForMap(SpResult, new Object[]{iSubCategoryModel.cID});
                            Long statusCResultLong = (Long) S_result.get("Status");
                            if(statusCResultLong == 1 ? true : false) {
                                KeyHolder keyHolder = new GeneratedKeyHolder();
                                jdbcTemplate.update(connection -> {
                                    PreparedStatement ps = connection.prepareStatement(commonQueryServicesModel.SubCategorySaveQuery, Statement.RETURN_GENERATED_KEYS);
                                    ps.setInt(1, iSubCategoryModel.cID);         // Index 1 for producttypeID
                                    ps.setString(2, iSubCategoryModel.code);     // Index 2 for Code
                                    ps.setString(3, iSubCategoryModel.path);     // Index 3 for path
                                    ps.setString(4, iSubCategoryModel.name);     // Index 4 for Value
                                    ps.setInt(5, iSubCategoryModel.isActive ? 1 : 0);     // Index 5 for Value
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
                            }else {
                                response.put("Message", "Category is Not valid");
                                response.put("Success", false);
                            }
                        }else {
                            response.put("Message", "Product is Not valid");
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
    public Map<String, Object> update(String Token, ISubCategoryModel iSubCategoryModel) {

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
                        int cid = Integer.parseInt(authjwtrepository.IdDecrypt(iSubCategoryModel.scID));
                        SpResult = jdbcTemplate.queryForObject(commonQueryServicesModel.SP, new Object[]{ProjectCodes.ProjectSpCodes.PRODUCTSTATUS.name()}, String.class);
                        Map<String, Object> S_result = jdbcTemplate.queryForMap(SpResult, new Object[]{iSubCategoryModel.pID});
                        Long statusResultLong = (Long) S_result.get("Status"); // Change to Long
                        if(statusResultLong == 1){
                            SpResult = jdbcTemplate.queryForObject(commonQueryServicesModel.SP, new Object[]{ProjectCodes.ProjectSpCodes.CATEGORYSTATUS.name()}, String.class);
                            Map<String, Object> C_result = jdbcTemplate.queryForMap(SpResult, new Object[]{iSubCategoryModel.cID});
                            Long statusCResultLong = (Long) S_result.get("Status");
                            if(statusCResultLong == 1) {
                                KeyHolder keyHolder = new GeneratedKeyHolder();
                                long rowsAffected = jdbcTemplate.update(connection -> {
                                    PreparedStatement ps = connection.prepareStatement(commonQueryServicesModel.SubCategoryEditQuery, Statement.RETURN_GENERATED_KEYS);
                                    ps.setInt(1, iSubCategoryModel.pID);
                                    //ps.setString(2, iSubCategoryModel.code);
                                    //ps.setString(2, iSubCategoryModel.path);
                                    ps.setString(2, iSubCategoryModel.name);
                                    ps.setInt(3, iSubCategoryModel.isActive ? 1 : 0);
                                    ps.setInt(4, cid);
                                    return ps;
                                }, keyHolder);
                                if(rowsAffected >= 1) {
                                    response.put("Message", "Data Updated!");
                                    response.put("Success", true);
                                }else{
                                    response.put("Message", "Data Not Updated!");
                                    response.put("Success", false);
                                }
                            }else {
                                response.put("Message", "Category is Not valid");
                                response.put("Success", false);
                            }
                        }else {
                            response.put("Message", "Product is Not valid");
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
    public Map<String, Object> delete(String Token, String scid) {
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
                        int cid = Integer.parseInt(authjwtrepository.IdDecrypt(scid));
                        KeyHolder keyHolder = new GeneratedKeyHolder();
                        long rowsAffected = jdbcTemplate.update(connection -> {
                            PreparedStatement ps = connection.prepareStatement(commonQueryServicesModel.SubCategoryDeleteQuery, Statement.RETURN_GENERATED_KEYS);
                            ps.setInt(1, 1);
                            ps.setInt(2, cid);
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
    public Map<String, Object> reStore(String Token, String scid) {
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
                        int cid = Integer.parseInt(authjwtrepository.IdDecrypt(scid));
                        KeyHolder keyHolder = new GeneratedKeyHolder();
                        long rowsAffected = jdbcTemplate.update(connection -> {
                            PreparedStatement ps = connection.prepareStatement(commonQueryServicesModel.SubCategoryDeleteQuery, Statement.RETURN_GENERATED_KEYS);
                            ps.setInt(1, 0);
                            ps.setInt(2, cid);
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
    public Map<String, Object> deactive(String Token, String scid) {
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
                        int cid = Integer.parseInt(authjwtrepository.IdDecrypt(scid));
                        KeyHolder keyHolder = new GeneratedKeyHolder();
                        long rowsAffected = jdbcTemplate.update(connection -> {
                            PreparedStatement ps = connection.prepareStatement(commonQueryServicesModel.SubCategoryIsActiveQuery, Statement.RETURN_GENERATED_KEYS);
                            ps.setInt(1, 0);
                            ps.setInt(3, cid);
                            return ps;
                        }, keyHolder);
                        if(rowsAffected > 0) {
                            response.put("Message", "Data DeActivated!");
                            response.put("Success", true);
                        }else{
                            response.put("Message", "Data Not DeActivated!");
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
    public Map<String, Object> reActivate(String Token, String scid) {
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
                        int cid = Integer.parseInt(authjwtrepository.IdDecrypt(scid));
                        KeyHolder keyHolder = new GeneratedKeyHolder();
                        long rowsAffected = jdbcTemplate.update(connection -> {
                            PreparedStatement ps = connection.prepareStatement(commonQueryServicesModel.SubCategoryIsActiveQuery, Statement.RETURN_GENERATED_KEYS);
                            ps.setInt(1, 0);
                            ps.setInt(3, cid);
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
    public Map<String, Object> getSubategoryDetails(String Token, String scId) {
        Map<String, Object> response = new HashMap<>();
        try {
            if (authjwtrepository.isTokenValid(Token)) {
                String username = authjwtrepository.getUsernameFromToken(Token);
                SpResult = jdbcTemplate.queryForObject(commonQueryServicesModel.SP, new Object[]{ProjectCodes.ProjectSpCodes.CHECKUSERROLE.name()}, String.class);
                Map<String, Object> result = jdbcTemplate.queryForMap(SpResult, new Object[]{username});
                String userRoleResult = (String) result.get("Result");
                if (userRoleResult != null) {
                    boolean isAdmin = Boolean.parseBoolean(userRoleResult);
                    int scid = Integer.parseInt(authjwtrepository.IdDecrypt(scId));

                    if (isAdmin) {
                        SpResult = jdbcTemplate.queryForObject(commonQueryServicesModel.SP, new Object[]{ProjectCodes.ProjectSpCodes.GETSUBCATEGORY.name()}, String.class);
                        var Product_Model = jdbcTemplate.execute(
                                SpResult,
                                (CallableStatementCallback<GetSubCategoryModel>) callableStatement -> {
                                    callableStatement.setInt(1, scid);
                                    boolean hasResults = callableStatement.execute();
                                    GetSubCategoryModel getSubCategoryModel = new GetSubCategoryModel();

                                    if (hasResults) {
                                        try (ResultSet rs = callableStatement.getResultSet()) {
                                            while (rs != null && rs.next()) {
                                                getSubCategoryModel.setScID(scid);
                                                getSubCategoryModel.setpID(rs.getInt("PID"));
                                                getSubCategoryModel.setcID(rs.getInt("CID"));
                                                getSubCategoryModel.setName(rs.getString("Value"));
                                                getSubCategoryModel.setPath(rs.getString("path"));
                                                getSubCategoryModel.setActive(rs.getBoolean("IsActive"));
                                            }
                                        }
                                    }
                                    return getSubCategoryModel;
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
}
