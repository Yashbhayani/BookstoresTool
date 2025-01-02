package com.bookstore.bookstore.CommonModel;

public class CommonQueryServicesModel {

    public String SP = "SELECT Name FROM sp_table WHERE Code = ?";

    public String ProductSaveQuery= "INSERT INTO producttypetable (Code, Name, IsActive) VALUES (?, ?, ?);";
    //public String ProductEditQuery= "UPDATE producttypetable SET Code = ?, Name = ?, IsActive = ? WHERE id = ?;";
    public String ProductEditQuery= "UPDATE producttypetable SET Name = ?, IsActive = ? WHERE id = ?;";
    public String ProductDeleteQuery= "UPDATE producttypetable SET IsDeleted = ? WHERE id = ?;";
    public String ProductIsActiveQuery= "UPDATE producttypetable SET IsActive = ? WHERE id = ?;";

    public String CategorySaveQuery = "INSERT INTO categorytypetable (producttypeID, Code, path, Value, IsActive) VALUES (?, ?, ?, ?, ?);";
    //public String CategoryEditQuery = "UPDATE categorytypetable SET producttypeID = ?, Code = ?, path = ?, Value = ?, IsActive = ? WHERE Id = ?;";
    public String CategoryEditQuery = "UPDATE categorytypetable SET producttypeID = ?, path = ?, Value = ?, IsActive = ? WHERE Id = ?;";
    public String CategoryDeleteQuery = "UPDATE categorytypetable SET IsDeleted = ? WHERE Id = ?;";
    public String CategoryIsActiveQuery = "UPDATE categorytypetable SET IsActive = ? WHERE Id = ?;";

    public String SubCategorySaveQuery = "INSERT INTO subcategorytypetable (categoryID, Code, path, Value, IsActive) VALUES (?, ?, ?, ?, ?);";
    //public String SubCategoryEditQuery = "UPDATE subcategorytypetable SET categoryID = ?, Code = ?, path = ?, Value = ?, IsActive = ? WHERE Id = ?;";
    public String SubCategoryEditQuery = "UPDATE subcategorytypetable SET categoryID = ?, path = ?, Value = ?, IsActive = ? WHERE Id = ?;";
    public String SubCategoryDeleteQuery = "UPDATE subcategorytypetable SET IsDeleted = ? WHERE Id = ?;";
    public String SubCategoryIsActiveQuery = "UPDATE subcategorytypetable SET IsActive = ? WHERE Id = ?;";

}
