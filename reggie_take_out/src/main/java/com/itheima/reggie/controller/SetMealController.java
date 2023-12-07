package com.itheima.reggie.controller;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.itheima.reggie.dto.SetmealDto;
import com.itheima.reggie.pojo.Setmeal;
import com.itheima.reggie.service.CategoryService;
import com.itheima.reggie.service.SetMealService;
import com.itheima.reggie.service.SetmealDishService;
import com.itheima.reggie.utils.Result;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/setmeal")
@Slf4j
public class SetMealController {

    @Autowired
    private SetMealService setMealService;

    @Autowired
    private CategoryService categoryService;

    /**
     * 添加套餐信息
     * @param setmealDto
     * @return
     */
    @CacheEvict(value = "setmealCache",allEntries = true)
    @PostMapping
    public Result<String> save(@RequestBody SetmealDto setmealDto){
        log.info("添加套餐信息");
        setMealService.saveWithDish(setmealDto);
        return Result.success("添加成功");

    }

    /**
     * 套餐分页查询
     * @param page
     * @param pageSize
     * @param name
     * @return
     */
    @GetMapping("/page")
    public Result<Page> page(int page,int pageSize,String name){
        log.info("分页查询，page：{}，pageSize：{}，name:{}"+page,pageSize,name);
        Page<Setmeal> pageInfo=new Page<>(page,pageSize);
        Page<SetmealDto> setmealDtoPage=new Page<>();

        LambdaQueryWrapper<Setmeal> lqw=new LambdaQueryWrapper<>();
        lqw.like(name!=null,Setmeal::getName,name);
        lqw.orderByDesc(Setmeal::getUpdateTime);
        setMealService.page(pageInfo,lqw);

        BeanUtils.copyProperties(pageInfo,setmealDtoPage,"records");

        List<Setmeal> records = pageInfo.getRecords();

        List<SetmealDto> list = records.stream().map((item) -> {
            SetmealDto setmealDto = new SetmealDto();
            BeanUtils.copyProperties(item, setmealDto);

            Long categoryId = item.getCategoryId();
            if (categoryId != null) {
                String categoryName = categoryService.getById(categoryId).getName();
                setmealDto.setCategoryName(categoryName);
            }
            return setmealDto;
        }).collect(Collectors.toList());

        setmealDtoPage.setRecords(list);

        return Result.success(setmealDtoPage);
    }

    /**
     * 批量删除套餐
     * @param ids
     * @return
     */
    @DeleteMapping
    @CacheEvict(value = "setmealCache",allEntries = true)
    public Result<String> delete(@RequestParam List<Long> ids){
        log.info("批量删除套餐信息");
        setMealService.deleteWithDish(ids);
        return Result.success("删除成功");
    }

    /**
     * 根据条件查询套餐
     * @param setmeal
     * @return
     */
    @Cacheable(value = "setmealCache", key = "#setmeal.id+'-'+#setmeal.status")
    @GetMapping("/list")
    public Result<List<Setmeal>> list(Setmeal setmeal){
        LambdaQueryWrapper<Setmeal> lqw=new LambdaQueryWrapper<>();
        lqw.eq(setmeal.getCategoryId()!=null,Setmeal::getCategoryId,setmeal.getCategoryId());
        lqw.eq(setmeal.getStatus()!=null,Setmeal::getStatus,setmeal.getStatus());
        lqw.orderByDesc(Setmeal::getUpdateTime);

        List<Setmeal> list = setMealService.list(lqw);

        return Result.success(list);
    }
}
