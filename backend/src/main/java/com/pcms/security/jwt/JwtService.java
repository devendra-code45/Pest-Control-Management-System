package com.pcms.security.jwt;

import java.security.Key;
import java.util.Date;

import org.springframework.stereotype.Service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;

@Service
public class JwtService {

    private static final String SECRET_KEY =
            "eE5VY2hMS0JiM0JYeHpUWHdCb2R3d2VFdjV2NmxPZnBvR0Y0QjhjQWZkcQ==";

    private static final long EXPIRATION_TIME =
            24 * 60 * 60 * 1000;

    private Key getSigningKey() {

        byte[] keyBytes =
                Decoders.BASE64.decode(SECRET_KEY);

        return Keys.hmacShaKeyFor(keyBytes);
    }

    public String generateToken(String email) {

        Date issuedAt = new Date();

        Date expiration = new Date(
                issuedAt.getTime() + EXPIRATION_TIME
        );

        return Jwts.builder()
                .setSubject(email)
                .setIssuedAt(issuedAt)
                .setExpiration(expiration)
                .signWith(
                        getSigningKey(),
                        SignatureAlgorithm.HS256
                )
                .compact();
    }

    public String extractEmail(String token) {

        return extractAllClaims(token)
                .getSubject();
    }

    public boolean isTokenValid(
            String token,
            String email) {

        return extractEmail(token).equals(email)
                && !isTokenExpired(token);
    }

    private boolean isTokenExpired(String token) {

        return extractAllClaims(token)
                .getExpiration()
                .before(new Date());
    }

    private Claims extractAllClaims(String token) {

        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
}