package com.itheima.reggie.utils;

import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.sql.SQLIntegrityConstraintViolationException;

/**
 * 全局异常处理工具类
 */

@ControllerAdvice(annotations = {RestController.class})
@ResponseBody
@Slf4j
public class globalExceptionHandler {

    /**
     * 处理数据库异常处理
     * @param ex
     * @return
     */
    @ExceptionHandler(SQLIntegrityConstraintViolationException.class)
    public Result<String> exceptionHandler(SQLIntegrityConstraintViolationException ex){
        log.error(ex.getMessage());
        if(ex.getMessage().contains("Duplicate entry")){
            String[] split = ex.getMessage().split(" ");
            return Result.error(split[2]+"已存在");
        }
        return Result.error("未知错误");
    }

    /**
     * 处理自定义异常
     * @param ex
     * @return
     */
    @ExceptionHandler(CustomException.class)
    public Result<String> excptionHandler(CustomException ex){
        log.error(ex.getMessage());
        return Result.error(ex.getMessage());
    }

}
