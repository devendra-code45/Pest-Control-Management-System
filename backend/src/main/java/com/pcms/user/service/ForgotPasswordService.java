package com.pcms.user.service;

import com.pcms.user.dto.ForgotPasswordRequest;
import com.pcms.user.dto.VerifyOtpRequest;
import com.pcms.user.dto.ResetPasswordRequest;

public interface ForgotPasswordService {

    void sendOtp(ForgotPasswordRequest request);

    void verifyOtp(VerifyOtpRequest request);

    void resetPassword(ResetPasswordRequest request);

}