package com.itheima.reggie.controller;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.itheima.reggie.pojo.ShoppingCart;
import com.itheima.reggie.service.ShoppingCartService;
import com.itheima.reggie.utils.BaseContext;
import com.itheima.reggie.utils.Result;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/shoppingCart")
@Slf4j
public class ShoppingCartController {

    @Autowired
    private ShoppingCartService shoppingCartService;

    /**
     * 在购物车中添加套餐或菜品
     * @param shoppingCart
     * @return
     */
    @PostMapping("/add")
    public Result<ShoppingCart> add(@RequestBody ShoppingCart shoppingCart) {
        log.info("添加菜品或套餐到购物车中：{}" + shoppingCart.toString());
        Long currentId = BaseContext.getCurrentId();
        shoppingCart.setUserId(currentId);

        //查询当前菜品或套餐是否在购物车中
        LambdaQueryWrapper<ShoppingCart> lqw = new LambdaQueryWrapper<>();
        lqw.eq(ShoppingCart::getUserId, currentId);

        if (shoppingCart.getDishId() != null) {
            //添加的是菜品，判断菜品口味是否存在
            lqw.eq(ShoppingCart::getDishId, shoppingCart.getDishId());
        } else {
            //添加的是套餐
            lqw.eq(ShoppingCart::getSetmealId, shoppingCart.getSetmealId());
        }

        ShoppingCart cartServiceOne = shoppingCartService.getOne(lqw);

        //判断添加的菜品或套餐是否存在
        if (cartServiceOne != null) {
            Integer number = cartServiceOne.getNumber();
            cartServiceOne.setNumber(number+1);
            shoppingCartService.updateById(cartServiceOne);
        }else{
            shoppingCart.setNumber(1);
            shoppingCart.setCreateTime(LocalDateTime.now());
            shoppingCartService.save(shoppingCart);
            cartServiceOne=shoppingCart;
        }

        return Result.success(cartServiceOne);
    }

    /**
     * 查看购物车
     * @return
     */
    @GetMapping("/list")
    public Result<List<ShoppingCart>> list(){
        log.info("查看购物车...");
        LambdaQueryWrapper<ShoppingCart> lqw=new LambdaQueryWrapper<>();
        Long currentId = BaseContext.getCurrentId();
        lqw.eq(ShoppingCart::getUserId,currentId);
        lqw.orderByAsc(ShoppingCart::getCreateTime);

        List<ShoppingCart> list = shoppingCartService.list(lqw);
        return Result.success(list);
    }

    /**
     * 清空购物车
     * @return
     */
    @DeleteMapping("/clean")
    public Result<String> clean(){
        log.info("清空购物车...");
        LambdaQueryWrapper<ShoppingCart> lqw=new LambdaQueryWrapper();
        lqw.eq(ShoppingCart::getUserId,BaseContext.getCurrentId());
        shoppingCartService.remove(lqw);
        return Result.success("成功清空购物车");
    }
}
