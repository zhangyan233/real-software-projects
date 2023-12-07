package com.itheima.reggie.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.itheima.reggie.dto.DishDto;
import com.itheima.reggie.mapper.DishMapper;
import com.itheima.reggie.pojo.Dish;
import com.itheima.reggie.pojo.DishFlavor;
import com.itheima.reggie.service.CategoryService;
import com.itheima.reggie.service.DishFlavorService;
import com.itheima.reggie.service.DishService;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class DishServiceImpl extends ServiceImpl<DishMapper, Dish> implements DishService {

    @Autowired
    private DishFlavorService dishFlavorService;

    /**
     * 新增菜品，同时保存对应的口味数据
     * @param dishDto
     */
    @Transactional
    @Override
    public void saveWithFlavor(DishDto dishDto) {
        this.save(dishDto);
        //获取菜品id
        Long dishId = dishDto.getId();
        ArrayList<DishFlavor> flavors = dishDto.getFlavors();
        for (DishFlavor flavor : flavors) {
            flavor.setDishId(dishId);
        }
        dishFlavorService.saveBatch(flavors);
    }

    /**
     * 根据id查询菜品信息
     * @param id
     * @return
     */
    @Override
    public DishDto getByIdWithFlavor(Long id) {
        Dish dish = this.getById(id);
        DishDto dishDto=new DishDto();
        BeanUtils.copyProperties(dish,dishDto);

        Long dishId = dish.getId();
        LambdaQueryWrapper<DishFlavor> lqw=new LambdaQueryWrapper<>();
        lqw.eq(dishId!=null,DishFlavor::getDishId,dishId);
        ArrayList<DishFlavor> list =(ArrayList<DishFlavor>) dishFlavorService.list(lqw);

        dishDto.setFlavors(list);

        return dishDto;
    }

    /**
     * 修改菜品信息
     * @param dishDto
     */
    @Override
    public void updateWithFlavor(DishDto dishDto) {
        this.updateById(dishDto);
        ArrayList<DishFlavor> flavors = dishDto.getFlavors();
        Long dishId = dishDto.getId();

        LambdaQueryWrapper<DishFlavor> lqw=new LambdaQueryWrapper<>();
        lqw.eq(dishId!=null,DishFlavor::getDishId,dishId);

        dishFlavorService.remove(lqw);

        for (DishFlavor flavor : flavors) {
            flavor.setDishId(dishId);
        }
        dishFlavorService.saveBatch(flavors);
    }

}
