package com.bookstore.bookstore.Controller;

import com.bookstore.bookstore.EntityModels.ICategoryModel;
import com.bookstore.bookstore.Repository.CategoryRepository;
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
public class CategoryController {

    @Autowired
    private final CategoryRepository categoryRepository;

    public CategoryController(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    @GetMapping("/category/list")
    public Map<String, Object> List(
            @RequestHeader("token") String Token,
            @RequestParam("report") String report
    ) throws IOException {
        return  categoryRepository.getCategory(Token, report);
    }

    @GetMapping("/category/select-category/list")
    public Map<String, Object> SelectList(
            @RequestHeader("token") String Token,
            @RequestParam("pid") int PID
    ) throws IOException {
        return  categoryRepository.getselectCategorylist(Token, PID);
    }

    @GetMapping("/category/code-verify")
    public  Map<String, Object> CategoryCode(
            @RequestHeader("token") String Token,
            @RequestParam("code") String Code
    ) throws IOException{
        return categoryRepository.getCategoryCode(Token, Code);
    }

    @GetMapping("/category/path-verify")
    public  Map<String, Object> CategoryPath(
            @RequestHeader("token") String Token,
            @RequestParam("path") String Code
    ) throws IOException{
        return categoryRepository.getCategoryPath(Token, Code);
    }

    @PostMapping("/category/save")
    public Map<String, Object> Save(
            @RequestHeader("token") String Token,
            @RequestBody ICategoryModel iCategoryModel
    ) throws IOException {
        return  categoryRepository.save(Token, iCategoryModel);
    }

    @PutMapping("/category/update")
    public Map<String, Object> Update(
            @RequestHeader("token") String Token,
            @RequestBody ICategoryModel iCategoryModel
    ) throws IOException {
        return  categoryRepository.update(Token, iCategoryModel);
    }

    @GetMapping ("/category/getcategory")
    public Map<String, Object> getCategoryDetails(
            @RequestHeader("token") String Token,
            @RequestParam("cid") String cId
    ) throws IOException {
        return  categoryRepository.getCategoryDetails(Token, cId);
    }

    @DeleteMapping("/category/delete")
    public Map<String, Object> Delete(
            @RequestHeader("token") String Token,
            @RequestParam("cid") String cId
    ) throws IOException {
        return  categoryRepository.delete(Token, cId);
    }

    @PutMapping("/category/restore")
    public Map<String, Object> ReStore(
            @RequestHeader("token") String Token,
            @RequestParam("cid") String cId
    ) throws IOException {
        return  categoryRepository.reStore(Token, cId);
    }

  @PutMapping("/category/active")
    public Map<String, Object> Active(
            @RequestHeader("token") String Token,
            @RequestParam("cid") String cId
    ) throws IOException {
        return  categoryRepository.reActivate(Token, cId);
    }

    @PutMapping("/category/deactive")
    public Map<String, Object> DeActive(
            @RequestHeader("token") String Token,
            @RequestParam("cid") String cId
    ) throws IOException {
        return  categoryRepository.deactive(Token, cId);
    }

}
