package com.itheima.reggie.controller;

import com.itheima.reggie.utils.Result;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletResponse;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.UUID;

@RestController
@RequestMapping("/common")
@Slf4j
public class CommonController {

    @Value("${raggie.path}")
    private String basePath;

    /**
     * 文件上传
     * @param file
     * @return
     */
    @PostMapping("/upload")
    public Result<String> upload(MultipartFile file){
        log.info(file.toString());
        //判断文件夹是否存在
        File dir=new File(basePath);
        if(!dir.exists()){
            dir.mkdirs();
        }
        //原始文件名
        String originalFilename = file.getOriginalFilename();
        String suffix = originalFilename.substring(originalFilename.lastIndexOf("."));
        //随机生成UUID
        String filename = UUID.randomUUID().toString()+suffix;
        try {
            file.transferTo(new File(basePath+filename));
        } catch (IOException e) {
            e.printStackTrace();
        }
        return Result.success(filename);
    }

    @GetMapping("/download")
    public void download(String name, HttpServletResponse response){

        try {
            //通过输入流读取文件
            FileInputStream fis=new FileInputStream(new File(basePath+name));
            //根据输出流将文件写回浏览器
            ServletOutputStream ops = response.getOutputStream();
            response.setContentType("image/jpg");
            int length=0;
            byte[] bytes=new byte[1024];
            while((length=fis.read(bytes))!=-1){
                ops.write(bytes,0,length);
                ops.flush();
            }
            ops.close();
            fis.close();
        } catch (Exception e) {
            e.printStackTrace();
        }

    }
}
