package com.itheima.reggie.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.itheima.reggie.dto.SetmealDto;
import com.itheima.reggie.pojo.Setmeal;

import java.util.List;

public interface SetMealService extends IService<Setmeal> {
    //新增套餐信息
    public void saveWithDish(SetmealDto setmealDto);

    //删除套餐信息
    public void deleteWithDish(List<Long> ids);
}
