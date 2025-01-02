package com.bookstore.bookstore.Repository;

import com.bookstore.bookstore.EntityModels.IProductModel;

import java.util.Map;

public interface ProductRepository {
    Map<String, Object> getproduct(String Token, String report);
    Map<String, Object> getselectproductlist(String Token);
    Map<String, Object> getproductcode(String Token, String Code);
    Map<String, Object> save(String Token, IProductModel iProductModel);
    Map<String, Object> update(String Token, IProductModel iProductModel);
    Map<String, Object> delete(String Token, String pId);
    Map<String, Object> reStore(String Token, String pId);
    Map<String, Object> reActivate (String Token, String pId);
    Map<String, Object> deActivate (String Token, String pId);
    Map<String, Object> getProductDetails(String Token, String pId);

}
