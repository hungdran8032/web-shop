package com.dran.webshop.service.Impl;

import com.dran.webshop.config.JwtProvider;
import com.dran.webshop.mapper.UserMapper;
import com.dran.webshop.model.Role;
import com.dran.webshop.model.User;
import com.dran.webshop.model.UserRole;
import com.dran.webshop.repository.UserRepository;
import com.dran.webshop.request.UserCreateRequest;
import com.dran.webshop.response.UserResponse;
import com.dran.webshop.service.RoleService;
import com.dran.webshop.service.UserService;
import com.dran.webshop.util.TypeToken;
import com.dran.webshop.util.USER_ROLE;

import jakarta.persistence.EntityExistsException;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;

import org.springframework.data.domain.Pageable;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;

@RequiredArgsConstructor
@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;
    private final RoleService roleService;
    private final JwtProvider jwtProvider;

    @Override
    public User findByUsername(String username) {
        return userRepository.findByUsername(username);

    }

    @Override
    public User findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    @Override
    public List<UserResponse> findAll(Integer page, Integer size) {
        Pageable pageable = Pageable.ofSize(size != null ? size : 10).withPage(page != null ? page : 0);
        List<User> users = userRepository.findAll(pageable).getContent();
        return users.stream().map(userMapper::toUserResponse).toList();
    }

    @Override
    public UserResponse createUser(UserCreateRequest req) {
        if (userRepository.existsByUsername(req.getUsername()))
            throw new EntityExistsException("Username is already taken");
        Role role = roleService.findByName(USER_ROLE.USER.name());
        User user = User.builder()
                .username(req.getUsername())
                .email(req.getEmail())
                .firstName(req.getFirstName())
                .lastName(req.getLastName())
                .phone(req.getPhone())
                .password(passwordEncoder.encode(req.getPassword()))
                .isLocked(Boolean.FALSE)
                .build();
        UserRole userRole = UserRole.builder()
                .user(user)
                .role(role)
                .build();

        user.setUserRoles(Set.of(userRole));
        return userMapper.toUserResponse(userRepository.save(user));
    }

    @Override
    public UserResponse updateUser(Long id, UserCreateRequest req) {
        User user = userRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("User not found"));
        user.setUsername(req.getUsername());
        user.setEmail(req.getEmail());
        user.setFirstName(req.getFirstName());
        user.setLastName(req.getLastName());
        user.setPhone(req.getPhone());
        if (req.getPassword() != null && !req.getPassword().isEmpty()) {
            user.setPassword(passwordEncoder.encode(req.getPassword()));
        }
        return userMapper.toUserResponse(userRepository.save(user));
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return userRepository.findByUsername(username);
    }

    @Override
    public User findUserByToken(String token) {
        Long userId = jwtProvider.getUserIdFromToken(token, TypeToken.ACCESS);
        return userRepository.findById(userId).orElseThrow(() -> new EntityNotFoundException("User not found"));
    }

}
