package com.bookstore.bookstore.Services;

import com.bookstore.bookstore.CommonModel.CommonQueryServicesModel;
import com.bookstore.bookstore.Enum.ProjectCodes;
import com.bookstore.bookstore.CustomModel.Model.DashboardModel;
import com.bookstore.bookstore.Repository.AuthJwtRepository;
import com.bookstore.bookstore.Repository.ReportRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Service;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

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

}
