package com.itheima.reggie.filter;

import com.alibaba.fastjson.JSON;
import com.itheima.reggie.utils.BaseContext;
import com.itheima.reggie.utils.Result;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.util.AntPathMatcher;

import javax.servlet.*;
import javax.servlet.annotation.WebFilter;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.net.URI;

/**
 * 拦截请求、放行工具类
 */
@WebFilter(filterName = "LoginCheckFilter", urlPatterns = "/*")
@Slf4j
public class LoginCheckFilter implements Filter {

    public static final AntPathMatcher path_Matcher = new AntPathMatcher();

    @Override
    public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain) throws IOException, ServletException {
        HttpServletRequest request = (HttpServletRequest) servletRequest;
        HttpServletResponse response = (HttpServletResponse) servletResponse;

        //1.获取本次请求的url
        String requestURI = request.getRequestURI();

        log.info("拦截到请求：{}"+requestURI);

        //获取不需要处理路径
        String[] urls = new String[]{
                "/employee/login",
                "/employee/logout",
                "/backend/**",
                "/front/**",
                "/common/**",
                "/user/sendMsg",
                "/user/login",
                "/doc.html",
                "/webjars/**",
                "/swagger-resources",
                "/v2/api-docs"
        };

        //2.判断本次请求是否需要处
        boolean check = check(urls, requestURI);

        //3.如果不需要处理，则直接放行
        if (check) {
            log.info("本次请求不需要处理：{}"+requestURI);
            filterChain.doFilter(request, response);
            return;
        }

        //4-1 判断登录状态，如果已登录，则直接放行
        Long empId = (Long) request.getSession().getAttribute("employee");
        if (empId != null) {
            log.info("用户已登录，用户id：{}"+request.getSession().getAttribute("employee"));
            //获取用户id
            BaseContext.setCurrentId(empId);

            filterChain.doFilter(request, response);
            return;
        }

        //4-2 判断登录状态，如果已登录，则直接放行
        Long userId = (Long) request.getSession().getAttribute("user");
        if (userId != null) {
            log.info("用户已登录，用户id：{}"+request.getSession().getAttribute("user"));
            //获取用户id
            BaseContext.setCurrentId(userId);

            filterChain.doFilter(request, response);
            return;
        }

        //5.如果未登录则返回登录结果
        log.info("用户未登录");
        response.getWriter().write(JSON.toJSONString(Result.error("NOTLOGIN")));
        return;
    }


    /**
     * 路径匹配，判断本次检查是否需要放行
     * @param urls
     * @param requestURI
     * @return
     */
    private boolean check(String[] urls,String requestURI) {
        for (String url : urls) {
            if(path_Matcher.match(url,requestURI)){
                return true;
            }
        }
        return false;
    }
}
