package com.itheima.reggie.controller;

import com.itheima.reggie.pojo.Orders;
import com.itheima.reggie.service.OrderService;
import com.itheima.reggie.utils.Result;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/order")
@Slf4j
public class OrderController {

    @Autowired
    private OrderService orderService;

    /**
     * 支付
     * @param orders
     * @return
     */
    @PostMapping("/submit")
    public Result<String> submit(@RequestBody Orders orders){
        log.info("提交的订单数据：{}"+orders.toString());
        orderService.submit(orders);
        return Result.success("下单成功");
    }
}
