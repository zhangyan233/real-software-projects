package com.itheima.reggie.controller;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.itheima.reggie.pojo.User;
import com.itheima.reggie.service.UserService;
import com.itheima.reggie.utils.Result;
import com.itheima.reggie.utils.ValidateCodeUtils;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpSession;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.TimeUnit;

@RequestMapping("/user")
@RestController
@Slf4j
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private RedisTemplate redisTemplate;

    /**
     * 发送短信验证码
     * @param user
     * @return
     */
    @PostMapping("/sendMsg")
    public Result<String> sendMsg(@RequestBody User user, HttpSession session){
        String phone=user.getPhone();
        if(StringUtils.isNotEmpty(phone)){
            String code= ValidateCodeUtils.generateValidateCode(4).toString();
            log.info("code={}",code);
//            session.setAttribute(phone,code);
            redisTemplate.opsForValue().set(phone,code,5, TimeUnit.MINUTES);
            return Result.success("已发送短信验证码到手机上");
        }
        return Result.error("短信发送失败");
    }

    /**
     * 移动端用户登录
     * @param map
     * @param session
     * @return
     */
    @PostMapping("/login")
    public Result<User> login(@RequestBody Map map, HttpSession session){
        log.info(map.toString());
        String phone = map.get("phone").toString();
        String code = map.get("code").toString();
//        Object codeInSession = session.getAttribute(phone);
        Object codeInSession=redisTemplate.opsForValue().get(phone);

        if(codeInSession!=null&&codeInSession.equals(code)){
            LambdaQueryWrapper<User> lqw=new LambdaQueryWrapper<>();
            lqw.eq(User::getPhone,phone);
            User user = userService.getOne(lqw);

            if(user==null){
                user=new User();
                user.setPhone(phone);
                user.setStatus(1);
                userService.save(user);
            }
            session.setAttribute("user",user.getId());
            redisTemplate.delete(phone);
            return Result.success(user);
        }
        return Result.error("验证码登录失败");
    }
}
