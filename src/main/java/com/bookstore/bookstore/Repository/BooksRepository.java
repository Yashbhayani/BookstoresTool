package com.bookstore.bookstore.Repository;

import org.springframework.web.multipart.MultipartFile;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.util.Map;

public interface BooksRepository {
    Map<String, Object> insertBookData(
            String Token,
            String BookName,
            int Price,
            String Description,
            String Author_Name,
            MultipartFile Thumbnailimage,
            MultipartFile Image,
            String language
    )  throws IOException;

    Map<String, Object>getBookData(String Token, Integer bookitem);
    Map<String, Object>getBook(String Token, String bookId);
    InputStream getResource(String Type, String fileName) throws FileNotFoundException;
}
