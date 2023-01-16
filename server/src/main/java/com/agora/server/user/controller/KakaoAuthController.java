package com.agora.server.user.controller;

import com.agora.server.user.service.KakaoAuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;

@RestController
@RequiredArgsConstructor
public class KakaoAuthController {

    private final KakaoAuthService kakaoAuthService;

    /**
     * 
     * @param  state => 로그인 요청인지 회원가입 요청인지 분리하기 위한 값
     *                 join : 회원가입 요청
     *                 login : 로그인 요청  
     * @throws IOException
     */
    @GetMapping("request/auth/kakao")
    public void kakaoLoginRedirect(@RequestParam String state) throws IOException {
        switch (state){
            case "join" :
                kakaoAuthService.joinRequest();
        }

    }

    /**
     * 회원가입 요청을 리다이렉트 받은 메소드
     * @param code : 유저 토큰을 받기 위한 code
     */
    @GetMapping("join/auth/kakao")
    public String kakaoLogin(@RequestParam String code){
        String token = kakaoAuthService.getKakaoToken(code);
        // 유저 확인

        // 이미 회원가입 되어있는지 확인

        return "code" + code; // dto 반환
    }

}