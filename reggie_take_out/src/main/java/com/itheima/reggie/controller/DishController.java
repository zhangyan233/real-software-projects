package com.itheima.reggie.controller;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.itheima.reggie.dto.DishDto;
import com.itheima.reggie.pojo.Category;
import com.itheima.reggie.pojo.Dish;
import com.itheima.reggie.pojo.DishFlavor;
import com.itheima.reggie.service.CategoryService;
import com.itheima.reggie.service.DishFlavorService;
import com.itheima.reggie.service.DishService;
import com.itheima.reggie.utils.Result;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/dish")
@Slf4j
public class DishController {
    @Autowired
    private DishService dishService;

    @Autowired
    private CategoryService categoryService;

    @Autowired
    private DishFlavorService dishFlavorService;

    @Autowired
    private RedisTemplate redisTemplate;

    /**
     * 新增菜品
     *
     * @param dishDto
     * @return
     */
    @PostMapping
    public Result<String> save(@RequestBody DishDto dishDto) {
        log.info("新增菜品,{}" + dishDto.toString());
        dishService.saveWithFlavor(dishDto);
        String key="dish_"+dishDto.getCategoryId()+"_"+dishDto.getStatus();
        redisTemplate.delete(key);
        return Result.success("新增菜品成功");
    }

    /**
     * 菜品信息查询
     *
     * @param page
     * @param pageSize
     * @param name
     * @return
     */
    @GetMapping("/page")
    public Result<Page> page(int page, int pageSize, String name) {
        log.info("分页查询，page：{}，pageSize：{}，name:{}"+page,pageSize,name);
        Page<Dish> pageInfo = new Page(page, pageSize);
        Page<DishDto> dishDtoPage = new Page<>();

        LambdaQueryWrapper<Dish> lqw = new LambdaQueryWrapper<>();
        lqw.like(name != null, Dish::getName, name);
        lqw.orderByDesc(Dish::getUpdateTime);
        dishService.page(pageInfo, lqw);

        BeanUtils.copyProperties(pageInfo, dishDtoPage, "records");

        List<Dish> records = pageInfo.getRecords();
        List<DishDto> list = records.stream().map((item) -> {
            DishDto dishDto = new DishDto();
            BeanUtils.copyProperties(item, dishDto);

            Long categoryId = item.getCategoryId();
            if (categoryService.getById(categoryId) != null) {
                String categoryName = categoryService.getById(categoryId).getName();
                dishDto.setCategoryName(categoryName);

            }
            return dishDto;
        }).collect(Collectors.toList());

        dishDtoPage.setRecords(list);

        return Result.success(dishDtoPage);
    }

    /**
     * 根据id查询菜品信息
     * @param id
     * @return
     */
    @GetMapping("/{id}")
    public Result<DishDto> get(@PathVariable Long id){
        log.info("根据id查询菜品信息");
        DishDto dishDto = dishService.getByIdWithFlavor(id);
        return Result.success(dishDto);
    }

    /**
     * 更新菜品信息
     * @param dishDto
     * @return
     */
    @PutMapping
    public Result<String> update(@RequestBody DishDto dishDto){
        log.info("修改指定菜品信息");
        dishService.updateWithFlavor(dishDto);
        String key="dish_"+dishDto.getCategoryId()+"_"+dishDto.getStatus();
        redisTemplate.delete(key);
        return Result.success("成功修改菜品信息");
    }

//    /**
//     * 根据菜品分类id查询菜品信息
//     * @param dish
//     * @return
//     */
//    @GetMapping("/list")
//    public Result<List<Dish>> list(Dish dish){
//        log.info("根据菜品分类查找菜品信息");
//        LambdaQueryWrapper<Dish> lqw=new LambdaQueryWrapper<>();
//        lqw.eq(dish.getCategoryId()!=null,Dish::getCategoryId,dish.getCategoryId());
//        lqw.eq(Dish::getStatus,1);
//        lqw.orderByAsc(Dish::getSort).orderByDesc(Dish::getUpdateTime);
//        List<Dish> list = dishService.list(lqw);
//        return Result.success(list);
//    }

    /**
     * 根据菜品分类id查询菜品信息
     * @param dish
     * @return
     */
    @GetMapping("/list")
    public Result<List<DishDto>> list(Dish dish){
        log.info("根据菜品分类查找菜品信息");
        //如果在redis缓存中，直接取出
        List<DishDto> dishDtoList=null;
        String key="dish_"+dish.getCategoryId()+"_"+dish.getStatus();
        dishDtoList=(List<DishDto>) redisTemplate.opsForValue().get(key);
        if(dishDtoList!=null){
            return Result.success(dishDtoList);
        }

        //不在缓存中，需要重新取出
        LambdaQueryWrapper<Dish> lqw=new LambdaQueryWrapper<>();
        lqw.eq(dish.getCategoryId()!=null,Dish::getCategoryId,dish.getCategoryId());
        lqw.eq(Dish::getStatus,1);
        lqw.orderByAsc(Dish::getSort).orderByDesc(Dish::getUpdateTime);
        List<Dish> list = dishService.list(lqw);

        dishDtoList = list.stream().map((item) -> {
            DishDto dishDto = new DishDto();
            BeanUtils.copyProperties(item, dishDto);

            Long categoryId = item.getCategoryId();
            Category category = categoryService.getById(categoryId);

            if (category != null) {
                String categoryName = category.getName();
                dishDto.setCategoryName(categoryName);
            }
            Long dishId = item.getId();
            LambdaQueryWrapper<DishFlavor> lqwFlavor = new LambdaQueryWrapper<>();
            lqwFlavor.eq(DishFlavor::getDishId, dishId);
            ArrayList<DishFlavor> flavorList = (ArrayList<DishFlavor>) dishFlavorService.list(lqwFlavor);
            dishDto.setFlavors(flavorList);
            return dishDto;
        }).collect(Collectors.toList());

        redisTemplate.opsForValue().set(key,dishDtoList,60, TimeUnit.MINUTES);
        return Result.success(dishDtoList);
    }
}




