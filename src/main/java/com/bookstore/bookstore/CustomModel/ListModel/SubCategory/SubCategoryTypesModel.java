package com.bookstore.bookstore.CustomModel.ListModel.SubCategory;

import com.bookstore.bookstore.CustomModel.Model.CategoryTypeModel;
import com.bookstore.bookstore.CustomModel.Model.SubCategoryTypeModel;

import java.util.List;

public class SubCategoryTypesModel {
    public int subCategoryCount;
    public List<SubCategoryTypeModel> subCategoryTypeModels;


    public SubCategoryTypesModel(){}

    public SubCategoryTypesModel(int subCategoryCount, List<SubCategoryTypeModel> subCategoryTypeModels) {
        this.subCategoryCount = subCategoryCount;
        this.subCategoryTypeModels = subCategoryTypeModels;
    }

    public int getSubCategoryCount() {
        return subCategoryCount;
    }

    public void setSubCategoryCount(int subCategoryCount) {
        this.subCategoryCount = subCategoryCount;
    }

    public List<SubCategoryTypeModel> getSubCategoryTypeModels() {
        return subCategoryTypeModels;
    }

    public void setSubCategoryTypeModels(List<SubCategoryTypeModel> subCategoryTypeModels) {
        this.subCategoryTypeModels = subCategoryTypeModels;
    }
}
