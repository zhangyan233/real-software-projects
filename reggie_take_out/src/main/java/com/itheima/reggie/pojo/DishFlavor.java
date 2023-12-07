package com.itheima.reggie.pojo;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.io.Serializable;
import java.time.LocalDateTime;

/**
菜品口味
 */
@Data
@TableName("dish_flavor")
public class DishFlavor implements Serializable {

    private static final long serialVersionUID = 1L;
    private Long id;
    private Long dishId;
    private String name;
    private String value;
    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createTime;
    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updateTime;
    @TableField(fill = FieldFill.INSERT)
    private Long createUser;
    @TableField(fill = FieldFill.INSERT_UPDATE)
    private Long updateUser;
    private Integer isDeleted;

}
