package com.bookstore.bookstore.Services;

import com.bookstore.bookstore.CommonModel.CommonQueryServicesModel;
import com.bookstore.bookstore.Enum.ProjectCodes;
import com.bookstore.bookstore.CustomModel.Model.DashboardModel;
import com.bookstore.bookstore.Repository.AuthJwtRepository;
import com.bookstore.bookstore.Repository.ReportRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.CallableStatementCallback;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Service;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.atomic.AtomicReference;

@Service
public class ReportServices implements ReportRepository {

    @Autowired
    private JdbcTemplate jdbcTemplate;
    public String SpResult = null;
    private final AuthJwtRepository authjwtrepository;
    CommonQueryServicesModel commonQueryServicesModel = new CommonQueryServicesModel();
    public ReportServices(AuthJwtRepository authjwtrepository) {
        this.authjwtrepository = authjwtrepository;
    }

    @Override
    public Map<String, Object> dashboard(String Token){
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
                        String procedureCall = "CALL AdminDashboard()";
                        List<DashboardModel> dashboardList = jdbcTemplate.query(procedureCall, new Object[]{}, new RowMapper<DashboardModel>() {
                            @Override
                            public DashboardModel mapRow(ResultSet rs, int rowNum) throws SQLException {
                                DashboardModel dashboard = new DashboardModel();
                                dashboard.setTotalUser(rs.getDouble("TotalUser"));
                                dashboard.setTotalBook(rs.getDouble("TotalBook"));
                                dashboard.setTotalLike(rs.getDouble("TotalLike"));
                                dashboard.setTotalAverageReview(rs.getDouble("AverageReview"));
                                return dashboard;
                            }
                        });
                        response.put("data", dashboardList);
                        response.put("Success", true);
                        response.put("Code", 200);
                    } else {
                        String procedureCall = "CALL UserAdminDashboard(?)";
                        List<DashboardModel> dashboardList = jdbcTemplate.query(procedureCall, new Object[]{username}, new RowMapper<DashboardModel>() {
                            @Override
                            public DashboardModel mapRow(ResultSet rs, int rowNum) throws SQLException {
                                DashboardModel dashboard = new DashboardModel();
                                dashboard.setTotalUser(Double.valueOf(0));
                                dashboard.setTotalBook(rs.getDouble("TotalBook"));
                                dashboard.setTotalLike(rs.getDouble("TotalLike"));
                                dashboard.setTotalAverageReview(rs.getDouble("AverageReview"));
                                return dashboard;
                            }
                        });
                        response.put("data", dashboardList);
                        response.put("Success", true);
                        response.put("Code", 200);
                    }
                }else {
                    response.put("Message", "User is Not valid");
                    response.put("Success", false);
                }
            }else{
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
    public Map<String, Object> chart(String Token) {
        return null;
    }

    @Override
    public Map<String, Object> fetchDetails(String Code,String report) {
        Map<String, Object> response = new HashMap<>();
        try {
            // Fetch the subcategory query
            String CodeQ = jdbcTemplate.queryForObject(
                    commonQueryServicesModel.SP,
                    new Object[]{Code},
                    String.class
            );

            AtomicReference<Object> listcount = new AtomicReference<>();
            List<Map<String, Object>> list = jdbcTemplate.execute(CodeQ,
                    (CallableStatementCallback<List<Map<String, Object>>>) callableStatement -> {
                        List<Map<String, Object>> data = new ArrayList<>();

                        // Set the report parameter
                        callableStatement.setString(1, report);

                        boolean hasResults = callableStatement.execute();
                        if (hasResults) {
                            try (ResultSet rs = callableStatement.getResultSet()) {
                                if (rs != null && rs.next()) {
                                    Map<String, Object> subCategoryInfo = new HashMap<>();
                                    for (int i = 1; i <= rs.getMetaData().getColumnCount(); i++) {
                                        listcount.set(rs.getObject(rs.getMetaData().getColumnName(i)));
                                    }
                                }
                            }

                            // Handle second result set for product details
                            if (callableStatement.getMoreResults()) {
                                try (ResultSet rs = callableStatement.getResultSet()) {
                                    while (rs != null && rs.next()) {
                                        Map<String, Object> details = new HashMap<>();
                                        for (int i = 1; i <= rs.getMetaData().getColumnCount(); i++) {
                                            String columnName = rs.getMetaData().getColumnLabel(i);
                                            if (i == 1) {
                                                try {
                                                    details.put(
                                                            rs.getMetaData().getColumnLabel(i),
                                                            authjwtrepository.IdEncrypt(rs.getInt(rs.getMetaData().getColumnLabel(i)))
                                                    );
                                                } catch (Exception e) {
                                                    throw new RuntimeException(e);
                                                }
                                            } else {
                                                details.put(rs.getMetaData().getColumnLabel(i), rs.getObject(rs.getMetaData().getColumnLabel(i)));
                                            }
                                        }
                                        data.add(details);
                                    }
                                }
                            }
                        }
                        return data;
                    });

            // Prepare the response with count and listdata
            if (list != null && !list.isEmpty()) {
                Map<String, Object> data = new HashMap<>();
                data.put("count", listcount.get());
                data.put("listdata", list);
                response.put("data", data);
                response.put("Success", true);
                response.put("Code", 200);
            } else {
                response.put("Message", "SubCategory List not found for the specified report.");
                response.put("Success", false);
            }
        } catch (Exception e) {
            response.put("Message", e.getMessage());
            response.put("Success", false);
        }

        return response;
    }


    @Override
    public boolean isUserAdmin(String username) {
        try {
            // Fetch the user role query
            String userRoleQuery = jdbcTemplate.queryForObject(
                    commonQueryServicesModel.SP,
                    new Object[]{ProjectCodes.ProjectSpCodes.CHECKUSERROLE.name()},
                    String.class
            );

            // Query the database to check the user's role
            Map<String, Object> result = jdbcTemplate.queryForMap(userRoleQuery, new Object[]{username});
            String userRoleResult = (String) result.get("Result");

            // Check if the user role is valid and if the user is an admin
            return userRoleResult != null && Boolean.parseBoolean(userRoleResult);
        } catch (Exception e) {
            // Handle any exceptions (e.g., database issues) gracefully
            return false;
        }
    }


}
