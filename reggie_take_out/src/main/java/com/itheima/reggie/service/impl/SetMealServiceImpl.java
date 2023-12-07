package com.itheima.reggie.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.itheima.reggie.dto.SetmealDto;
import com.itheima.reggie.mapper.SetMealMapper;
import com.itheima.reggie.pojo.Setmeal;
import com.itheima.reggie.pojo.SetmealDish;
import com.itheima.reggie.service.SetMealService;
import com.itheima.reggie.service.SetmealDishService;
import com.itheima.reggie.utils.CustomException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class SetMealServiceImpl extends ServiceImpl<SetMealMapper, Setmeal> implements SetMealService {

    @Autowired
    private SetmealDishService setmealDishService;

    /**
     * 新增套餐菜品
     */
    @Override
    public void saveWithDish(SetmealDto setmealDto) {
        this.save(setmealDto);
        Long id = setmealDto.getId();
        List<SetmealDish> setmealDishes = setmealDto.getSetmealDishes();
        for (SetmealDish setmealDish : setmealDishes) {
            setmealDish.setSetmealId(id);
        }
        setmealDishService.saveBatch(setmealDishes);
    }

    /**
     * 删除套餐信息
     * @param ids
     */
    @Transactional
    @Override
    public void deleteWithDish(List<Long> ids) {
        LambdaQueryWrapper<Setmeal> lqwMeal=new LambdaQueryWrapper<>();
        lqwMeal.in(Setmeal::getId,ids);
        lqwMeal.eq(Setmeal::getStatus,1);
        int count = this.count(lqwMeal);
        if(count>0){
            throw new CustomException("套餐正在售卖中，不能删除");
        }

        this.removeByIds(ids);

        LambdaQueryWrapper<SetmealDish> lqw=new LambdaQueryWrapper<>();
        lqw.in(SetmealDish::getSetmealId,ids);
        setmealDishService.remove(lqw);
    }
}
