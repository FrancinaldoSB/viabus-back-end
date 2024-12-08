package com.viabus.viabus_api.service;

import org.springframework.stereotype.Service;

import com.viabus.viabus_api.model.User;
import com.viabus.viabus_api.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;

@Service
public class UserService {

  @Autowired
  private UserRepository userRepository;

  public List<User> getAllUsers() {
    return userRepository.findAll();
  }

  public User getUserById(Long id) {
    return userRepository.findById(id)
        .orElseThrow(() -> new RuntimeException("User not found"));
  }

  public User createUser(User user) {
    return userRepository.save(user);
  }

  public User updateUser(Long id, User updatedUser) {
    User user = getUserById(id);
    user.setName(updatedUser.getName());
    user.setEmail(updatedUser.getEmail());
    user.setCpf(updatedUser.getCpf());
    return userRepository.save(user);
  }

  public void deleteUser(Long id) {
    userRepository.deleteById(id);
  }
}
