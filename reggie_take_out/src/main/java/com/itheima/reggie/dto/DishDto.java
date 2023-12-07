package com.itheima.reggie.dto;

import com.itheima.reggie.pojo.Dish;
import com.itheima.reggie.pojo.DishFlavor;
import lombok.Data;

import java.util.ArrayList;

@Data
public class DishDto extends Dish {

    private ArrayList<DishFlavor> flavors=new ArrayList<>();
    private String categoryName;
    private Integer copies;
}
