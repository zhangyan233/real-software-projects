package com.itheima.reggie.pojo;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 菜品
 */
@Data
@TableName("dish")
public class Dish implements Serializable {

    private static final long serialVersionUID = 1L;
    private Long id;
    private String name;
    private Long categoryId;
    private BigDecimal price;
    private String code;
    private String image;
    private String description;
    private Integer status;
    private Integer sort;
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
