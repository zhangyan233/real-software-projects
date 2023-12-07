package com.itheima.reggie.controller;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.itheima.reggie.pojo.Category;
import com.itheima.reggie.service.CategoryService;
import com.itheima.reggie.service.DishService;
import com.itheima.reggie.service.SetMealService;
import com.itheima.reggie.utils.Result;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/category")
@Slf4j
public class CategoryController {

    @Autowired
    private CategoryService categoryService;


    /**
     * 新增套餐分类
     * @param category
     * @return
     */
    @PostMapping
    public Result<String> save(@RequestBody Category category){
        log.info("添加套餐分类....");
        categoryService.save(category);
        return Result.success("套餐分类添加成功");
    }

    /**
     * 分页查询
     * @param page
     * @param pageSize
     * @return
     */
    @GetMapping("/page")
    public Result<Page> page(int page, int pageSize){
        log.info("开始分页查询，page：{},pageSize:{}");
        Page<Category> pageInfo=new Page<Category>(page,pageSize);
        LambdaQueryWrapper<Category> lqw=new LambdaQueryWrapper();
        lqw.orderByAsc(Category::getSort);
        categoryService.page(pageInfo,lqw);
        return Result.success(pageInfo);

    }

    /**
     * 根据id删除分类信息
     * @param id
     * @return
     */
    @DeleteMapping
    public Result<String> deleteById(Long id){
        log.info("根据id删除菜品分类");
        categoryService.remove(id);
        return Result.success("删除成功");
    }

    /**
     * 根据id修改菜品分类信息
     * @param category
     * @return
     */
    @PutMapping
    public Result<String> update(@RequestBody Category category){
        log.info("根据id修改菜品分类");
        categoryService.updateById(category);
        return Result.success("菜品分类修改成功");
    }

    /**
     * 根据条件查询分类数据
     * @param category
     * @return
     */
    @GetMapping("/list")
    public Result<List<Category>> list(Category category){
        log.info("根据条件查询");
        LambdaQueryWrapper<Category> lqw=new LambdaQueryWrapper<>();
        lqw.eq(category.getType()!=null,Category::getType,category.getType());
        lqw.orderByAsc(Category::getSort).orderByAsc(Category::getUpdateTime);
        List<Category> categoryList = categoryService.list(lqw);
        return Result.success(categoryList);

    }
}
