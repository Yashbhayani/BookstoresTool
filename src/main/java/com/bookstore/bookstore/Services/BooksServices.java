package com.bookstore.bookstore.Services;

import com.bookstore.bookstore.CommonModel.CommonQueryServicesModel;
import com.bookstore.bookstore.CustomModel.Model.BookModel;
import com.bookstore.bookstore.CustomModel.Model.BooksModel;
import com.bookstore.bookstore.Enum.ProjectCodes;
import com.bookstore.bookstore.CustomModel.JsonModel.Category;
import com.bookstore.bookstore.CustomModel.JsonModel.CategoryType;
import com.bookstore.bookstore.CustomModel.JsonModel.CategoryTypesBook;
import com.bookstore.bookstore.CustomModel.JsonModel.ProductType;
import com.bookstore.bookstore.Repository.AuthJwtRepository;
import com.bookstore.bookstore.Repository.BooksRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.jdbc.core.CallableStatementCallback;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.*;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.*;

@Service    
public class BooksServices  implements BooksRepository {
    @Autowired
    private JdbcTemplate jdbcTemplate;

    private final AuthJwtRepository authjwtrepository;

    @Value("${project.images}")
    private String path;

    @Value("${project.thumbnailimage}")
    private String thumbnailimagepath;
    public String SpResult = null;
    CommonQueryServicesModel commonQueryServicesModel = new CommonQueryServicesModel();

    public BooksServices(AuthJwtRepository authjwtrepository) {
        this.authjwtrepository = authjwtrepository;
    }

    @Override
    public Map<String, Object> insertBookData(
            String Token,
            String BookName,
            int Price,
            String Description,
            String Author_Name,
            MultipartFile Thumbnailimage,
            MultipartFile Image,
            String language
    ) throws IOException {
        Map<String, Object> response = new HashMap<>();
        try{
            if (authjwtrepository.isTokenValid(Token)) {
                int maxDescriptionLength = 500;
                if (Description.length() > 500) {
                    String username = authjwtrepository.getUsernameFromToken(Token);
                    SpResult = jdbcTemplate.queryForObject(commonQueryServicesModel.SP, new Object[]{ProjectCodes.ProjectSpCodes.FINDEIDANDCHECKSTATUS.name()}, String.class);
                    Map<String, Object> result = jdbcTemplate.queryForMap(SpResult, new Object[]{username});
                    String userRoleResult = (String) result.get("Result");
                    if (userRoleResult != null) {
                        boolean isAdmin = Boolean.parseBoolean(userRoleResult);
                        if (isAdmin) {
                            String newQuery = "INSERT INTO bookstable (userid, BookName, Price, Description, Author_Name) VALUES (?, ?, ?, ?, ?, ?)";
                            KeyHolder keyHolder = new GeneratedKeyHolder();
                            int UID = (int) result.get("ID");
                            jdbcTemplate.update(connection -> {
                                PreparedStatement ps = connection.prepareStatement(newQuery, Statement.RETURN_GENERATED_KEYS);
                                ps.setDouble(1, UID);
                                ps.setString(2, BookName);
                                ps.setDouble(4, Price);
                                ps.setString(5, Description);
                                ps.setString(6, Author_Name);
                                return ps;
                            }, keyHolder);
                            Long generatedId = keyHolder.getKey().longValue();

                            String Thumbnailname = Thumbnailimage.getOriginalFilename();
                            String ThumbnailrendomId = UUID.randomUUID().toString();
                            String ThumbnailFileRandomName = ThumbnailrendomId.concat(Thumbnailname.substring(Thumbnailname.lastIndexOf(".")));
                            String ThumbnailFullPath = thumbnailimagepath + File.separator + ThumbnailFileRandomName;
                            File Thumbnailf = new File(thumbnailimagepath);
                            if (!Thumbnailf.exists()) {
                                Thumbnailf.mkdir();
                            }
                            Files.copy(Image.getInputStream(), Paths.get(ThumbnailFullPath));
                            String ThumbnailimageQuery = "INSERT INTO thumbnailimagetable (bookId, image) VALUES (?, ?)";
                            jdbcTemplate.update(ThumbnailimageQuery, generatedId, ThumbnailFileRandomName);

                            String name = Image.getOriginalFilename();
                            String rendomId = UUID.randomUUID().toString();
                            String FileRandomName = rendomId.concat(name.substring(name.lastIndexOf(".")));
                            String FullPath = path + File.separator + FileRandomName;
                            File f = new File(path);
                            if (!f.exists()) {
                                f.mkdir();
                            }
                            Files.copy(Image.getInputStream(), Paths.get(FullPath));
                            String ImagetableQuery = "INSERT INTO imagetable (bookId, image) VALUES (?, ?)";
                            jdbcTemplate.update(ImagetableQuery, generatedId, FileRandomName);


                            String Query = "INSERT INTO languagetable (bookId, language) VALUES (?, ?)";
                            jdbcTemplate.update(Query, generatedId, language);

                            response.put("Message", "Data Added!");
                            response.put("Success", true);
                        } else {
                            response.put("Message", "User is Not valid");
                            response.put("Success", false);
                        }
                    } else {
                        response.put("Message", "User can't add it!");
                        response.put("Success", false);
                    }
                } else {
                    response.put("Message", "Up to 500");
                    response.put("Success", false);
                }
            } else {
                response.put("Message", "User is Not valid");
                response.put("Success", false);
            }
        }catch (Exception e){
            response.put("Message", e.getMessage());
            response.put("Success", false);
        }
        return  response;
    }

    @Override
    public Map<String, Object> getBookData(String Token, Integer bookitem) {
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
                        SpResult = jdbcTemplate.queryForObject(commonQueryServicesModel.SP, new Object[]{ProjectCodes.ProjectSpCodes.GETBOOKSWITHREVIEWSTARS.name()}, String.class);

                        List<BooksModel> booksList = jdbcTemplate.query(SpResult, new Object[]{bookitem}, new RowMapper<BooksModel>() {
                            @Override
                            public BooksModel mapRow(ResultSet rs, int rowNum) throws SQLException {
                                BooksModel book = new BooksModel();
                                try {
                                    book.setId(authjwtrepository.IdEncrypt(rs.getInt("BookID")));
                                } catch (Exception e) {
                                    throw new RuntimeException(e);
                                }
                                book.setLanguageid(rs.getInt("LanguageID"));
                                book.setBookName(rs.getString("BookName"));
                                book.setLanguage_Name(rs.getString("language_Name"));
                                book.setImage(rs.getString("Image"));
                                book.setPrice(rs.getDouble("Price"));
                                book.setAuthor_Name(rs.getString("Author_Name"));
                                book.setReview_Star(rs.getDouble("Review_Star"));
                                book.setDiscount_percentage(rs.getDouble("discount_percentage"));
                                return book;
                            }
                        });
                        response.put("data", booksList);
                        response.put("Success", true);
                        response.put("Code", 200);
                    } else {
                        SpResult = jdbcTemplate.queryForObject(commonQueryServicesModel.SP, new Object[]{ProjectCodes.ProjectSpCodes.GETBOOKSFORUSERADMIN.name()}, String.class);
                        List<BooksModel> booksList = jdbcTemplate.query(SpResult, new Object[]{username,bookitem}, new RowMapper<BooksModel>() {
                            @Override
                            public BooksModel mapRow(ResultSet rs, int rowNum) throws SQLException {
                                BooksModel book = new BooksModel();
                                try {
                                    book.setId(authjwtrepository.IdEncrypt(rs.getInt("BookID")));
                                } catch (Exception e) {
                                    throw new RuntimeException(e);
                                }                                book.setLanguageid(rs.getInt("LanguageID"));
                                book.setBookName(rs.getString("BookName"));
                                book.setLanguage_Name(rs.getString("language_Name"));
                                book.setImage(rs.getString("Image"));
                                book.setPrice(rs.getDouble("Price"));
                                book.setAuthor_Name(rs.getString("Author_Name"));
                                book.setReview_Star(rs.getDouble("Review_Star"));
                                book.setDiscount_percentage(rs.getDouble("discount_percentage"));
                                return book;
                            }
                        });
                        response.put("data", booksList);
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
    public Map<String, Object> getBook(String token, String bookId) {
        Map<String, Object> response = new HashMap<>();

        try {
            if (authjwtrepository.isTokenValid(token)) {
                String username = authjwtrepository.getUsernameFromToken(token);
                SpResult = jdbcTemplate.queryForObject(commonQueryServicesModel.SP, new Object[]{ProjectCodes.ProjectSpCodes.CHECKUSERROLE.name()}, String.class);
                String userResult = jdbcTemplate.queryForObject(SpResult, new Object[]{username}, String.class);

                if ("True".equals(userResult)) {
                    int bid = Integer.parseInt(authjwtrepository.IdDecrypt(bookId));
                    SpResult = jdbcTemplate.queryForObject(commonQueryServicesModel.SP, new Object[]{ProjectCodes.ProjectSpCodes.BOOKALLDETAILS.name()}, String.class);

                    List<BookModel> booksList = jdbcTemplate.execute(SpResult, (CallableStatementCallback<List<BookModel>>) callableStatement -> {
                        List<BookModel> bookList = new ArrayList<>();
                        callableStatement.setInt(1, bid);
                        boolean hasResults = callableStatement.execute();

                        while (hasResults) {
                            try (ResultSet rs = callableStatement.getResultSet()) {
                                while (rs != null && rs.next()) {
                                    BookModel book = new BookModel();
                                    book.setBookName(rs.getString("BookName"));
                                    book.setImage(rs.getString("Image"));
                                    book.setThumbnailImage(rs.getString("ThumbnailImage"));
                                    book.setPrice(rs.getDouble("Price"));
                                    book.setDescription(rs.getString("Description"));
                                    book.setAuthorName(rs.getString("Author_Name"));
                                    book.setLanguage(rs.getString("language_Name"));
                                    book.setStar(rs.getDouble("Review_Star"));
                                    book.setTotalReview(rs.getDouble("TotalReview"));
                                    book.setBooklike(rs.getDouble("BookLike"));
                                    book.setDiscount_percentage( rs.getDouble( "discount_percentage"));

                                    // Process category information
                                    if (callableStatement.getMoreResults()) {
                                        try (ResultSet rsCategory = callableStatement.getResultSet()) {
                                            List<CategoryTypesBook> CategoryTypesBookList = new ArrayList<>();
                                            if (rsCategory != null && rsCategory.next()) {
                                                do {
                                                    CategoryTypesBook categoryTypesBook = new CategoryTypesBook();
                                                    categoryTypesBook.setCategoryTypesBookId(rsCategory.getInt("categorytypesbook_Id"));

                                                    CategoryType categoryType = new CategoryType();
                                                    categoryType.setCategoryTypeId(rsCategory.getInt("categorytype_Id"));
                                                    categoryType.setCategoryTypeName(rsCategory.getString("categorytype_Name"));

                                                    Category category = new Category();
                                                    category.setCategoryId(rsCategory.getInt("category_ID"));
                                                    category.setCategoryName(rsCategory.getString("category_Name"));

                                                    ProductType productType = new ProductType();
                                                    productType.setProductTypeId(rsCategory.getInt("producttype_ID"));
                                                    productType.setProductTypeName(rsCategory.getString("producttype_Name"));

                                                    category.setProductType(productType);
                                                    categoryType.setCategory(category);
                                                    categoryTypesBook.setCategoryType(categoryType);
                                                    CategoryTypesBookList.add(categoryTypesBook);
                                                } while (rsCategory.next());
                                                book.setCategoryTypesBook(CategoryTypesBookList);

                                            }
                                        } catch (Exception ex) {
                                            // Handle exception
                                            System.out.println(ex.getMessage());
                                        }
                                    }
                                    bookList.add(book);
                                }
                            } catch (Exception ex) {
                                // Handle exception
                                System.out.println(ex.getMessage());
                            }
                            hasResults = callableStatement.getMoreResults();
                        }
                        return bookList;
                    });
                    if (booksList != null && !booksList.isEmpty()) {
                        response.put("data", booksList);
                        response.put("Success", true);
                        response.put("Code", 200);
                    } else {
                        response.put("Message", "Books not found for the specified language.");
                        response.put("Success", false);
                    }
                } else {
                    response.put("Message", "User is not valid");
                    response.put("Success", false);
                }
            } else {
                response.put("Message", "User is not valid");
                response.put("Success", false);
            }
        } catch (Exception e) {
            response.put("Message", e.getMessage());
            response.put("Success", false);
        }
        return response;
    }


    public InputStream getResource(String Type, String fileName) throws FileNotFoundException {
        if(Type == "bookthumbnailimage") {
            String fullpath = thumbnailimagepath + File.separator + fileName;
            InputStream is = new FileInputStream(fullpath);
            return is;
        }else {
            String fullpath = path + File.separator + fileName;
            InputStream is = new FileInputStream(fullpath);
            return is;
        }
    }
}
