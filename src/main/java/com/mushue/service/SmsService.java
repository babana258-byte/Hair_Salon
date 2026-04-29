package com.mushue.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.Instant;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class SmsService {

    private static final Logger log = LoggerFactory.getLogger(SmsService.class);

    /** 驗證碼有效期（秒） */
    private static final long OTP_TTL_SECONDS = 300;

    /** 每支手機號碼的冷卻時間（秒），防止頻繁發送 */
    private static final long RESEND_COOLDOWN_SECONDS = 60;

    private final SecureRandom random = new SecureRandom();

    /** key = 手機號碼, value = OtpEntry */
    private final Map<String, OtpEntry> otpStore = new ConcurrentHashMap<>();

    // ── 發送驗證碼 ──────────────────────────────────────────
    /**
     * @return true 發送成功；false 冷卻時間內重複請求
     */
    public boolean sendOtp(String phone) {
        OtpEntry existing = otpStore.get(phone);
        if (existing != null) {
            long elapsed = Instant.now().getEpochSecond() - existing.createdAt;
            if (elapsed < RESEND_COOLDOWN_SECONDS) {
                return false; // 冷卻中
            }
        }

        String code = generateCode();
        otpStore.put(phone, new OtpEntry(code, Instant.now().getEpochSecond()));

        // ── TODO: 替換為真實簡訊發送邏輯 ──
        log.info("[SMS STUB] 手機 {} 驗證碼：{}", phone, code);

        return true;
    }

    // ── 驗證驗證碼 ──────────────────────────────────────────
    public VerifyResult verifyOtp(String phone, String code) {
        OtpEntry entry = otpStore.get(phone);
        if (entry == null) {
            return VerifyResult.NOT_FOUND;
        }
        long elapsed = Instant.now().getEpochSecond() - entry.createdAt;
        if (elapsed > OTP_TTL_SECONDS) {
            otpStore.remove(phone);
            return VerifyResult.EXPIRED;
        }
        if (!entry.code.equals(code)) {
            return VerifyResult.WRONG_CODE;
        }
        otpStore.remove(phone); // 驗證成功後立即作廢
        return VerifyResult.SUCCESS;
    }

    // ── 工具 ────────────────────────────────────────────────
    private String generateCode() {
        int num = random.nextInt(900000) + 100000; // 6 位數
        return String.valueOf(num);
    }

    // ── 內部類別 ─────────────────────────────────────────────
    private static class OtpEntry {
        final String code;
        final long createdAt; // epoch seconds

        OtpEntry(String code, long createdAt) {
            this.code = code;
            this.createdAt = createdAt;
        }
    }

    public enum VerifyResult {
        SUCCESS, WRONG_CODE, EXPIRED, NOT_FOUND
    }
}
