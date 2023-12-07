package com.itheima.reggie.service;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.IService;
import com.itheima.reggie.dto.DishDto;
import com.itheima.reggie.pojo.Dish;
import com.itheima.reggie.utils.Result;

public interface DishService extends IService<Dish> {
    //新增菜品
    public void saveWithFlavor(DishDto dishDto);

    //查询菜品
    public DishDto getByIdWithFlavor(Long id);

    //修改菜品
    void updateWithFlavor(DishDto dishDto);
}
