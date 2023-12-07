package com.itheima.reggie.utils;

import lombok.Data;

import java.io.Serializable;
import java.util.HashMap;
import java.util.Map;

/**
 * 结果工具类
 * @param <T>
 */
@Data
public class Result<T> implements Serializable {
    private Integer code;//1为成功，0为失败
    private T data;
    private String msg;
    private Map map = new HashMap();//动态数据

    public static <T> Result<T> success(T object) {
        Result<T> result = new Result<T>();
        result.code=1;
        result.data=object;
        return result;
    }

    public static <T> Result<T> error(String msg){
        Result<T> result = new Result<T>();
        result.code=0;
        result.msg=msg;
        return result;
    }

    public Result<T> add(String key,Object value){
        map.put(key,value);
        return this;
    }
}
