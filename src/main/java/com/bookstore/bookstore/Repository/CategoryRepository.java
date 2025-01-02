package com.bookstore.bookstore.Repository;

import com.bookstore.bookstore.EntityModels.ICategoryModel;

import java.util.Map;

public interface CategoryRepository {
    Map<String, Object> getCategory(String Token, String report);
    Map<String, Object> getselectCategorylist(String Token, int PID);
    Map<String, Object> getCategoryCode(String Token, String report);
    Map<String, Object> getCategoryPath(String Token, String report);
    Map<String, Object> save(String Token, ICategoryModel iCategoryModel);
    Map<String, Object> update(String Token, ICategoryModel iCategoryModel);
    Map<String, Object> delete(String Token, String cId);
    Map<String, Object> reStore(String Token, String cId);
    Map<String, Object> getCategoryDetails(String Token, String cId);
    Map<String, Object> reActivate(String Token, String cId);
    Map<String, Object> deactive(String Token, String cId);

}
