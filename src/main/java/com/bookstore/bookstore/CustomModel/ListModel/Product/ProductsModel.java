package com.bookstore.bookstore.CustomModel.ListModel.Product;

import com.bookstore.bookstore.CustomModel.Model.ProductModel;

import java.util.List;

public class ProductsModel {
    public int productCount;
    public List<ProductModel> productModels;

    public int getProductCount() {
        return productCount;
    }

    public void setProductCount(int productCount) {
        this.productCount = productCount;
    }

    public List<ProductModel> getProductModels() {
        return productModels;
    }

    public void setProductModels(List<ProductModel> productModels) {
        this.productModels = productModels;
    }

    public ProductsModel(){}

    public ProductsModel(int productCount, List<ProductModel> productModels) {
        this.productCount = productCount;
        this.productModels = productModels;
    }
}
