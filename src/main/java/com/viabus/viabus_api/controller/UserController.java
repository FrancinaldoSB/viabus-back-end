package com.viabus.viabus_api.controller;

import org.springframework.web.bind.annotation.*;

import com.viabus.viabus_api.model.User;
import com.viabus.viabus_api.service.UserService;

import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;

@RestController
@RequestMapping("/users")
public class UserController {

  @Autowired
  private UserService userService;

  // GET /users
  @GetMapping
  public List<User> getAllUsers() {
    return userService.getAllUsers();
  }

  // GET /users/{id}
  @GetMapping("/{id}")
  public User getUserById(@PathVariable Long id) {
    return userService.getUserById(id);
  }

  // POST /users
  @PostMapping
  public User createUser(@RequestBody User user) {
    return userService.createUser(user);
  }

  // PUT /users/{id}
  @PutMapping("/{id}")
  public User updateUser(@PathVariable Long id, @RequestBody User user) {
    return userService.updateUser(id, user);
  }

  // DELETE /users/{id}
  @DeleteMapping("/{id}")
  public void deleteUser(@PathVariable Long id) {
    userService.deleteUser(id);
  }
}
