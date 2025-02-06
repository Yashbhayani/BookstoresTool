package com.bookstore.bookstore.Enum;

public class ProjectCodes {

    // Define the nested enum ProjectSpCodes inside the ProjectCodes class
    public enum ProjectSpCodes {
        CHECKUSERROLE,
        GETBOOKSWITHREVIEWSTARS,
        BOOKALLDETAILS,
        GETBOOKSFORUSERADMIN,
        VERIFYPRODUCTCODE,
        FINDEIDANDCHECKSTATUS,
        VERIFYCATEGORYCODE,
        VERIFYCATEGORYPATH,
        VERIFYSUBCATEGORYCODE,
        VERIFYSUBCATEGORYPATH,
        PRODUCTSTATUS,
        CATEGORYSTATUS,
        GETPRODUCT,
        GETCATEGORY,
        GETSUBCATEGORY
    }
    public enum LoginCode{
        LOGINCODE
    }
    public enum ReportCods{
        ALLPRODUCTTYPES,
        ALLCATEGORYTYPES,
        ALLSUBCATEGORYTYPES,
        ADMINLIST,
        USERADMINLIST,
        USERLIST
    }
    public enum SelectCodes{
        SELECTPRODUCT,
        SELECTCATEGORY,
        SELECTSUBCATEGORY
    }
}