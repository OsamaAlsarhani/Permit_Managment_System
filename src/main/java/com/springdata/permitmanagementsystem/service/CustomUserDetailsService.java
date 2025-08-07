package com.springdata.permitmanagementsystem.service;

import com.springdata.permitmanagementsystem.model.entity.User;
import com.springdata.permitmanagementsystem.repository.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collection;
import java.util.List;
@Service
public class CustomUserDetailsService implements UserDetailsService {


    private final UserRepo userRepo;
    public CustomUserDetailsService(UserRepo userRepo) {
        this.userRepo = userRepo;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepo.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        String rawRole = user.getRole(); // could be "USER" or "ROLE_USER"
        String normalized = rawRole.startsWith("ROLE_") ? rawRole.substring(5) : rawRole;
        List<GrantedAuthority> authorities = List.of(new SimpleGrantedAuthority(normalized));
        return org.springframework.security.core.userdetails.User
                .withUsername(user.getUsername())
                .password(user.getPassword())
                .roles(normalized)
                .build();
    }
}

