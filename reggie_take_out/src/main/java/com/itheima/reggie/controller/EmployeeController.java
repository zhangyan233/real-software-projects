package com.itheima.reggie.controller;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.itheima.reggie.pojo.Employee;
import com.itheima.reggie.service.EmployeeService;
import com.itheima.reggie.utils.Result;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.DigestUtils;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;

import java.time.LocalDateTime;

import static com.itheima.reggie.utils.Result.error;
import static com.itheima.reggie.utils.Result.success;

@Slf4j
@RestController
@RequestMapping("/employee")
public class EmployeeController {

    @Autowired
    private EmployeeService employeeService;

    /**
     * 登录功能
     *
     * @param request
     * @param employee
     * @return
     */
    @PostMapping("/login")
    public Result<Employee> login(HttpServletRequest request, @RequestBody Employee employee) {
        //1、将页面提交的密码password进行m5加密处理
        String password = employee.getPassword();
        password = DigestUtils.md5DigestAsHex(password.getBytes());

        // 2、根据页面提交的username查询数据库
        LambdaQueryWrapper<Employee> lqw = new LambdaQueryWrapper<>();
        lqw.eq(Employee::getUsername, employee.getUsername());
        Employee emp = employeeService.getOne(lqw);

        //3、如果没有查询到则返回登录失败结果
        if (emp == null) {
            return Result.error("用户名不存在，登录失败");
        }

        //4、密码比对，如果不一致则返回登录失败结果
        if (!emp.getPassword().equals(password)) {
            return Result.error("密码不一致，登录失败");
        }

        //5、查看员工状态，如果为已禁用状态，则返回员工已禁用结果
        if (emp.getStatus() == 0) {
            return Result.error("员工已禁用，登录失败");
        }

        //6、登录成功，将员工id存入session并返回登录成功结果
        request.getSession().setAttribute("employee", emp.getId());
        return Result.success(emp);
    }


    /**
     * 退出登录
     *
     * @param request
     * @return
     */
    @PostMapping("/logout")
    public Result<String> logOut(HttpServletRequest request) {
        //1.清理session中的用户id
        request.getSession().removeAttribute("employee");
        //2、返回结果
        return Result.success("退出成功");
    }

    /**
     * 添加员工
     *
     * @param employee
     * @return
     */
    @PostMapping
    public Result<String> save(HttpServletRequest request, @RequestBody Employee employee) {
        Long empId = (Long) request.getSession().getAttribute("employee");
        employee.setCreateUser(empId);
        employee.setUpdateUser(empId);
        employeeService.save(employee);
        return Result.success("新增员工成功");
    }

    /**
     * 分页查询功能
     *
     * @param page
     * @param pageSize
     * @param name
     * @return
     */
    @GetMapping("/page")
    public Result<Page> page(int page, int pageSize, String name) {
        log.info("page={},pageSize={},name={}" + page, pageSize, name);
        //构造分页构造器
        Page pageInfo = new Page(page, pageSize);

        //构造条件构造器
        LambdaQueryWrapper<Employee> lqw = new LambdaQueryWrapper<>();
        lqw.like(StringUtils.isNotEmpty(name), Employee::getName, name);
        lqw.orderByDesc(Employee::getUpdateTime);

        //执行查询
        employeeService.page(pageInfo, lqw);

        return Result.success(pageInfo);
    }


    /**
     * 根据id修改员工信息
     *
     * @param employee
     * @return
     */
    @PutMapping
    public Result<String> update(HttpServletRequest request, @RequestBody Employee employee) {
        log.info(employee.toString());
        Long empid = (Long) request.getSession().getAttribute("employee");
        employee.setUpdateTime(LocalDateTime.now());
        employee.setUpdateUser(empid);
        employeeService.updateById(employee);
        return Result.success("成功修改员工信息");
    }

    /**
     * 根据id查询员工信息
     *
     * @param id
     * @return
     */
    @GetMapping("/{id}")
    public Result<Employee> getById(@PathVariable Long id) {
        log.info("根据id查找员工:{}" + id);
        Employee employee = employeeService.getById(id);
        if (employee != null){
            return Result.success(employee);
        }
            return Result.error("没有查询到这个员工");
    }

}
