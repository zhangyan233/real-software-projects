package com.itheima.reggie.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.itheima.reggie.mapper.EmployeeMapper;
import com.itheima.reggie.pojo.Employee;
import com.itheima.reggie.service.EmployeeService;
import org.springframework.stereotype.Service;
import org.springframework.util.DigestUtils;

import javax.servlet.http.HttpServletRequest;
import java.time.LocalDateTime;

@Service
public class EmployeeServiceImpl extends ServiceImpl<EmployeeMapper, Employee> implements EmployeeService {

   @Override
    public boolean save(Employee employee) {
        //设置初始密码
        employee.setPassword(DigestUtils.md5DigestAsHex("123456".getBytes()));

        //设置创建时间
        employee.setCreateTime(LocalDateTime.now());

        //设置更新时间
        employee.setUpdateTime(LocalDateTime.now());

        return super.save(employee);
    }
}
