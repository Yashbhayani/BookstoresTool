package com.bookstore.bookstore.Controller;

import com.bookstore.bookstore.EntityModels.ICategoryModel;
import com.bookstore.bookstore.EntityModels.ISubCategoryModel;
import com.bookstore.bookstore.Repository.CategoryRepository;
import com.bookstore.bookstore.Repository.SubCategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.Map;

@ComponentScan(basePackages = "com.bookstore.bookstore.Services")
@Configuration
@RestController
@RequestMapping("api")
public class SubCategoryController {

    @Autowired
    private final SubCategoryRepository subCategoryRepository;

    public SubCategoryController(SubCategoryRepository subCategoryRepository) {
        this.subCategoryRepository = subCategoryRepository;
    }

    @GetMapping("/subcategory/list")
    public Map<String, Object> List(
            @RequestHeader("token") String Token,
            @RequestParam("report") String report
    ) throws IOException {
        return  subCategoryRepository.getSubCategory(Token, report);
    }
    @GetMapping("/subcategory/select-subcategory/list")
    public Map<String, Object> SelectList(
            @RequestHeader("token") String Token,
            @RequestParam("scid") int scid
    ) throws IOException {
        return subCategoryRepository.getselectSubCategorylist(Token, scid);
    }

    @GetMapping("/subcategory/code-verify")
    public  Map<String, Object> SubCategoryCode(
            @RequestHeader("token") String Token,
            @RequestParam("code") String Code
    ) throws IOException{
        return subCategoryRepository.getSubCategoryCode(Token, Code);
    }

    @GetMapping("/subcategory/path-verify")
    public  Map<String, Object> SubCategoryPath(
            @RequestHeader("token") String Token,
            @RequestParam("code") String Code
    ) throws IOException{
        return subCategoryRepository.getSubCategoryPath(Token, Code);
    }

    @PostMapping("/subcategory/save")
    public Map<String, Object> Save(
            @RequestHeader("token") String Token,
            @RequestBody ISubCategoryModel iSubCategoryModel
    ) throws IOException {
        return  subCategoryRepository.save(Token, iSubCategoryModel);
    }

    @PutMapping("/subcategory/update")
    public Map<String, Object> Update(
            @RequestHeader("token") String Token,
            @RequestBody ISubCategoryModel iSubCategoryModel
    ) throws IOException {
        return  subCategoryRepository.update(Token, iSubCategoryModel);
    }

    @DeleteMapping("/subcategory/delete")
    public Map<String, Object> Delete(
            @RequestHeader("token") String Token,
            @RequestParam("scid") String scid
    ) throws IOException {
        return  subCategoryRepository.delete(Token, scid);
    }

    @DeleteMapping("/subcategory/reStore")
    public Map<String, Object> ReStore(
            @RequestHeader("token") String Token,
            @RequestParam("scid") String scid
    ) throws IOException {
        return  subCategoryRepository.reStore(Token, scid);
    }

    @GetMapping ("/subcategory/getSubategory")
    public Map<String, Object> getSubategoryDetails(
            @RequestHeader("token") String Token,
            @RequestParam("scid") String scId
    ) throws IOException {
        return  subCategoryRepository.getSubategoryDetails(Token, scId);
    }

    @PutMapping("/subcategory/deactive")
    public Map<String, Object> ActiveDelete(
            @RequestHeader("token") String Token,
            @RequestParam("scid") String cId
    ) throws IOException {
        return  subCategoryRepository.deactive(Token, cId);
    }

    @PutMapping("/subcategory/active")
    public Map<String, Object> Active(
            @RequestHeader("token") String Token,
            @RequestParam("scid") String cId
    ) throws IOException {
        return  subCategoryRepository.reActivate(Token, cId);
    }
}
