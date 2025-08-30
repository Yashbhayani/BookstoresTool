package com.bookstore.bookstore.Services;

import com.bookstore.bookstore.CommonModel.CommonQueryServicesModel;
import com.bookstore.bookstore.Enum.ProjectCodes;
import com.bookstore.bookstore.CustomModel.Model.DashboardModel;
import com.bookstore.bookstore.Repository.AuthJwtRepository;
import com.bookstore.bookstore.Repository.ReportRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.CallableStatementCallback;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Service;

import javax.crypto.BadPaddingException;
import javax.crypto.IllegalBlockSizeException;
import javax.crypto.NoSuchPaddingException;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.*;
import java.util.concurrent.atomic.AtomicReference;

@Service
public class ReportServices implements ReportRepository {

    @Autowired
    private JdbcTemplate jdbcTemplate;
    public String SpResult = null;
    private final AuthJwtRepository authjwtrepository;
    CommonQueryServicesModel commonQueryServicesModel = new CommonQueryServicesModel();
    Set<String> encryptedFields = new HashSet<>(Arrays.asList("id", "userid", "uiid"));

    public ReportServices(AuthJwtRepository authjwtrepository) {
        this.authjwtrepository = authjwtrepository;
    }

    @Override
    public Map<String, Object> dashboard(String Token){
        Map<String, Object> response = new HashMap<>();
        try{
            if (authjwtrepository.isTokenValid(Token)) {
                String username = authjwtrepository.getUsernameFromToken(Token);
                SpResult = jdbcTemplate.queryForObject(commonQueryServicesModel.SP, new Object[]{ProjectCodes.ProjectSpCodes.checkuserrole.name().toUpperCase()}, String.class);
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
            AtomicReference<Object> useradmincount = new AtomicReference<>();
            List<Map<String, Object>> list = jdbcTemplate.execute(CodeQ,
                    (CallableStatementCallback<List<Map<String, Object>>>) callableStatement -> {
                        List<Map<String, Object>> data = new ArrayList<>();

                        // Set the report parameter
                        callableStatement.setString(1, report);

                        boolean hasResults = callableStatement.execute();
                        if (hasResults) {
                            try (ResultSet rs = callableStatement.getResultSet()) {
                                while (rs != null && rs.next()) {
                                    for (int i = 1; i <= rs.getMetaData().getColumnCount(); i++) {
                                        listcount.set(rs.getObject(rs.getMetaData().getColumnName(i)));
                                    }
                                }
                            }

                            if (callableStatement.getMoreResults()) {
                                try (ResultSet rs = callableStatement.getResultSet()) {
                                    while (rs != null && rs.next()) {
                                        Map<String, Object> details = new HashMap<>();
                                        for (int i = 1; i <= rs.getMetaData().getColumnCount(); i++) {
                                            String columnName = rs.getMetaData().getColumnLabel(i);
                                            if (encryptedFields.contains(columnName.toLowerCase())) {
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

                            if (callableStatement.getMoreResults()) {
                                try (ResultSet rs = callableStatement.getResultSet()) {
                                    if (rs != null && rs.next()) {
                                        for (int i = 1; i <= rs.getMetaData().getColumnCount(); i++) {
                                            useradmincount.set(rs.getObject(rs.getMetaData().getColumnName(i)));
                                        }
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
                if(useradmincount.get() != null && useradmincount.get() != "0"){
                    data.put("useradmincount", listcount.get());
                }
                response.put("data", data);
                response.put("Success", true);
                response.put("Code", 200);
            } else {
                response.put("Message", "List not found for the specified report.");
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
                    new Object[]{ProjectCodes.ProjectSpCodes.checkuserrole.name().toUpperCase()},
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


    @Override
    public Map<String, Object> fetchSelectDetails(String Code, int id ) {
        Map<String, Object> response = new HashMap<>();
        try {
            // Fetch the subcategory query
            String CodeQ = jdbcTemplate.queryForObject(
                    commonQueryServicesModel.SP,
                    new Object[]{Code},
                    String.class
            );

            List<Map<String, Object>> list = jdbcTemplate.execute(CodeQ,
                    (CallableStatementCallback<List<Map<String, Object>>>) callableStatement -> {
                        if (id != 0) {
                            callableStatement.setInt(1, id);
                        }
                        List<Map<String, Object>> data = new ArrayList<>();
                        boolean hasResults = callableStatement.execute();
                        if (hasResults) {
                                try (ResultSet rs = callableStatement.getResultSet()) {
                                    while (rs != null && rs.next()) {
                                        Map<String, Object> details = new HashMap<>();
                                        for (int i = 1; i <= rs.getMetaData().getColumnCount(); i++) {
                                            String columnName = rs.getMetaData().getColumnLabel(i);
                                            if (encryptedFields.contains(columnName.toLowerCase())) {
                                                try {
                                                    details.put(
                                                            rs.getMetaData().getColumnLabel(i),
                                                            rs.getInt(rs.getMetaData().getColumnLabel(i))                                                    );
                                                } catch (Exception e) {
                                                    throw new RuntimeException(e);
                                                }
                                            } else {
                                                details.put(rs.getMetaData().getColumnLabel(i), rs.getObject(rs.getMetaData().getColumnLabel(i)));
                                            }
                                        }
                                        data.add(details);
                                    }
                                } catch (Exception e) {
                                    throw new RuntimeException(e);
                                }

                        }
                        return data;
                    });

            // Prepare the response with count and listdata
            if (list != null && !list.isEmpty()) {
                Map<String, Object> data = new HashMap<>();
                data.put("listdata", list);
                response.put("data", data);
                response.put("Success", true);
                response.put("Code", 200);
            } else {
                response.put("Message", "List not found for the specified report.");
                response.put("Success", false);
            }
        } catch (Exception e) {
            response.put("Message", e.getMessage());
            response.put("Success", false);
        }

        return response;
    }


    @Override
    public Map<String, Object> fetchListData(String Code, int id ) {
        Map<String, Object> response = new HashMap<>();
        try {
            // Fetch the subcategory query
            String CodeQ = jdbcTemplate.queryForObject(
                    commonQueryServicesModel.SP,
                    new Object[]{Code},
                    String.class
            );

            List<Map<String, Object>> list = jdbcTemplate.execute(CodeQ,
                    (CallableStatementCallback<List<Map<String, Object>>>) callableStatement -> {
                        if (id != 0) {
                            callableStatement.setInt(1, id);
                        }
                        List<Map<String, Object>> data = new ArrayList<>();
                        boolean hasResults = callableStatement.execute();
                        if (hasResults) {
                            try (ResultSet rs = callableStatement.getResultSet()) {
                                while (rs != null && rs.next()) {
                                    Map<String, Object> details = new HashMap<>();
                                    for (int i = 1; i <= rs.getMetaData().getColumnCount(); i++) {
                                        String columnName = rs.getMetaData().getColumnLabel(i);
                                        if (encryptedFields.contains(columnName.toLowerCase())) {
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
                            } catch (Exception e) {
                                throw new RuntimeException(e);
                            }

                        }
                        return data;
                    });

            // Prepare the response with count and listdata
            if (list != null && !list.isEmpty()) {
                Map<String, Object> data = new HashMap<>();
                data.put("listdata", list);
                response.put("data", data);
                response.put("Success", true);
                response.put("Code", 200);
            } else {
                response.put("Message", "List not found for the specified report.");
                response.put("Success", false);
            }
        } catch (Exception e) {
            response.put("Message", e.getMessage());
            response.put("Success", false);
        }

        return response;
    }


    @Override
    public Map<String, Object> getdatafromJsonOb(String jsonString) throws NoSuchPaddingException, IllegalBlockSizeException, NoSuchAlgorithmException, BadPaddingException, InvalidKeyException {
        Map<String, Object> response = new HashMap<>();
        try {
            ObjectMapper mapper = new ObjectMapper();
            Map<String, Object> jsonMap = mapper.readValue(jsonString, Map.class);

            for (Map.Entry<String, Object> entry : jsonMap.entrySet()) {
                if(entry.getKey().toLowerCase().contains("id")){
                    String key = entry.getKey();
                    Object value = entry.getValue();
                    int newval = Objects.equals(value, 0) ? 0 : Integer.parseInt(authjwtrepository.IdDecrypt((String) value));
                    jsonMap.put(key, newval);
                }
            }
            response.put("Success", true);
            response.put("data", jsonMap);
        } catch (JsonProcessingException e) {
            response.put("Success", false);
            response.put("Message", e.getMessage() );
        }
        return response;
    }

/*
    @Override
    public Map<String, Object> fetchDeta(String Code,String report) {
        Map<String, Object> response = new HashMap<>();
        try {
            // Fetch the subcategory query
            String CodeQ = jdbcTemplate.queryForObject(
                    commonQueryServicesModel.SP,
                    new Object[]{Code},
                    String.class
            );

            List<Map<String, Object>> list = jdbcTemplate.execute(CodeQ,
                    (CallableStatementCallback<List<Map<String, Object>>>) callableStatement -> {
                        List<Map<String, Object>> data = new ArrayList<>();

                        // Set the report parameter
                        callableStatement.setString(1, report);

                        boolean hasResults = callableStatement.execute();
                        if (hasResults) {
                            while (ResultSet rs = callableStatement.getResultSet()){
                                try (rs !=  null) {
                                    while (rs != null && rs.next()) {
                                        Map<String, Object> details = new HashMap<>();
                                        for (int i = 1; i <= rs.getMetaData().getColumnCount(); i++) {
                                            String columnName = rs.getMetaData().getColumnLabel(i);
                                            if (encryptedFields.contains(columnName.toLowerCase())) {
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
                data.put("listdata", list);
                response.put("data", data);
                response.put("Success", true);
                response.put("Code", 200);
            } else {
                response.put("Message", "List not found for the specified report.");
                response.put("Success", false);
            }
        } catch (Exception e) {
            response.put("Message", e.getMessage());
            response.put("Success", false);
        }

        return response;
    }
*/

    @Override
    public Map<String, Object> fetchDeta(String Code, String report) {
        Map<String, Object> response = new HashMap<>();
        try {
            // Fetch the subcategory query
            String CodeQ = jdbcTemplate.queryForObject(
                    commonQueryServicesModel.SP,
                    new Object[]{Code},
                    String.class
            );

            Map<String, Object> listdata = jdbcTemplate.execute(CodeQ,
                    (CallableStatementCallback<Map<String, Object>>) callableStatement -> {
                        Map<String, Object> datas = new HashMap<>();

                        // Set the report parameter
                        callableStatement.setString(1, report);

                        boolean hasResults = callableStatement.execute();
                        int resultSetIndex = 0;

                        while (hasResults) {

                            try (ResultSet rs = callableStatement.getResultSet()) {
                                List<Map<String, Object>> data = new ArrayList<>();
                                String resultsetName = null;

                                if (rs != null) {
                                    while (rs.next()) {
                                        if (resultsetName == null) {
                                            resultsetName = rs.getString("resultset_name"); // 👈 detect set name
                                        }
                                        Map<String, Object> details = new HashMap<>();
                                        for (int i = 1; i <= rs.getMetaData().getColumnCount(); i++) {
                                            String columnName = rs.getMetaData().getColumnLabel(i);
                                            if (encryptedFields.contains(columnName.toLowerCase())) {
                                                details.put(
                                                        columnName,
                                                        authjwtrepository.IdEncrypt(rs.getInt(columnName))
                                                );
                                            } else {
                                                details.put(columnName, rs.getObject(columnName));
                                            }
                                        }
                                        data.add(details);
                                    }
                                }

                                if (resultsetName == null) {
                                    resultsetName = "resultset_" + resultSetIndex;
                                }
                                datas.put(resultsetName.toLowerCase(), data);
                                resultSetIndex++;
                            } catch (Exception e) {
                                throw new RuntimeException(e);
                            }
                            hasResults = callableStatement.getMoreResults();
                        }

                        return datas;
                    });

            // Prepare the response with count and listdata
            if (listdata != null && !listdata.isEmpty()) {
                Map<String, Object> data = new HashMap<>();
                data.put("listdata", listdata);
                response.put("data", data);
                response.put("Success", true);
                response.put("Code", 200);
            } else {
                response.put("Message", "List not found for the specified report.");
                response.put("Success", false);
            }
        } catch (Exception e) {
            response.put("Message", e.getMessage());
            response.put("Success", false);
        }

        return response;
    }

}
