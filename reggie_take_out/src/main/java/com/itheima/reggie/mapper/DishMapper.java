package com.itheima.reggie.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.itheima.reggie.pojo.Dish;
import org.apache.ibatis.annotations.Mapper;

import java.util.stream.BaseStream;

@Mapper
public interface DishMapper extends BaseMapper<Dish> {
}
