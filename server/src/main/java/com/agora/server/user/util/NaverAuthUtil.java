package com.agora.server.user.util;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Component;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;

@Component
public class NaverAuthUtil {
    @Value("${oauth.naver.redirect.header}")
    private String getRedirectHeader;

    @Value("${oauth.naver.redirect.header-value}")
    private String getRedirectHeaderValue;

    @Value("${oauth.naver.redirect.url}")
    private String getRedirectUrl;

    @Value("${oauth.naver.redirect.grant-type}")
    private String getGrantType;

    @Value("${oauth-key.naver.client-id}")
    private String getClientId;

    @Value("${oauth-key.naver.client-secret}")
    private String getClientSecret;

    @Value("${oauth.naver.get-info.url}")
    private String getInfoUrl;

    @Value("@{oauth.naver.get-info.header-type}")
    private String getInfoHeaderType;

    @Value("${oauth.naver.get-info.header-value}")
    private String getInfoHeaderValue;

    @Value("${oauth.naver.get-info.auth.header-type}")
    private String getInfoAuthHeader;

    @Value("${oauth.naver.get-info.auth.header-value}")
    private String getInfoAuthHeaderValue;

    /**
     * @param code redirect 후 받은 code
     * @return redirect 된 후 code를 가지고 token을 받아오기 위한 함수
     */
    public HttpEntity<?> getTokenHttpEntity(String code) {
        HttpHeaders headers = new HttpHeaders();
        headers.add(getRedirectHeader, getRedirectHeaderValue);
        MultiValueMap<String, String> params = getParams(code);
        return new HttpEntity<>(params, headers);
    }

    private MultiValueMap<String, String> getParams(String code) {
        MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
        params.add("grant_type", getGrantType);
        params.add("client_id", getClientId);
        params.add("client_secret", getClientSecret);
        params.add("code", code);
        return params;
    }

}