package com.itheima.reggie.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.itheima.reggie.mapper.CategoryMapper;
import com.itheima.reggie.pojo.Category;
import com.itheima.reggie.pojo.Dish;
import com.itheima.reggie.pojo.Setmeal;
import com.itheima.reggie.service.CategoryService;
import com.itheima.reggie.service.DishService;
import com.itheima.reggie.service.SetMealService;
import com.itheima.reggie.utils.CustomException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class CategoryServiceImpl extends ServiceImpl<CategoryMapper, Category> implements CategoryService {

    @Autowired
    private DishService dishService;

    @Autowired
    private SetMealService setMealService;


    @Override
    public void remove(Long id) {
        LambdaQueryWrapper<Dish> dishLqw=new LambdaQueryWrapper<>();
        dishLqw.eq(Dish::getCategoryId,id);
        int countDish = dishService.count(dishLqw);
        if(countDish>0){
            throw new CustomException("当前分类已关联菜品，无法删除");
        }

        LambdaQueryWrapper<Setmeal> setMealLqw=new LambdaQueryWrapper<>();
        setMealLqw.eq(Setmeal::getCategoryId,id);
        int countSetMeal = setMealService.count();
        if(countSetMeal>0){
            throw new CustomException("当前分类已关联套餐，无法删除");
        }

        super.removeById(id);

    }
}
