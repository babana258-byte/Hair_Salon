package com.mushue.controller;

import com.mushue.service.SmsService;
import com.mushue.service.SmsService.VerifyResult;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private SmsService smsService;

    // ── POST /api/auth/send-sms ──────────────────────────────
    @PostMapping("/send-sms")
    public ResponseEntity<Map<String, Object>> sendSms(
            @Valid @RequestBody SendSmsRequest req) {

        boolean sent = smsService.sendOtp(req.phone());
        if (!sent) {
            return ResponseEntity.status(429)
                    .body(Map.of("success", false, "message", "請稍後再試，驗證碼已發送"));
        }
        return ResponseEntity.ok(Map.of("success", true, "message", "驗證碼已發送"));
    }

    // ── POST /api/auth/verify-sms ────────────────────────────
    @PostMapping("/verify-sms")
    public ResponseEntity<Map<String, Object>> verifySms(
            @Valid @RequestBody VerifySmsRequest req) {

        VerifyResult result = smsService.verifyOtp(req.phone(), req.code());

        return switch (result) {
            case SUCCESS  -> ResponseEntity.ok(Map.of("success", true,  "message", "驗證成功"));
            case EXPIRED  -> ResponseEntity.badRequest()
                    .body(Map.of("success", false, "message", "驗證碼已過期，請重新發送"));
            case WRONG_CODE -> ResponseEntity.badRequest()
                    .body(Map.of("success", false, "message", "驗證碼錯誤"));
            case NOT_FOUND  -> ResponseEntity.badRequest()
                    .body(Map.of("success", false, "message", "請先發送驗證碼"));
        };
    }

    // ── Request DTOs ─────────────────────────────────────────
    record SendSmsRequest(
            @NotBlank(message = "手機號碼不得為空")
            @Pattern(regexp = "^09\\d{8}$", message = "手機號碼格式不正確")
            String phone
    ) {}

    record VerifySmsRequest(
            @NotBlank(message = "手機號碼不得為空")
            @Pattern(regexp = "^09\\d{8}$", message = "手機號碼格式不正確")
            String phone,

            @NotBlank(message = "驗證碼不得為空")
            @Pattern(regexp = "^\\d{6}$", message = "驗證碼格式不正確")
            String code
    ) {}
}
