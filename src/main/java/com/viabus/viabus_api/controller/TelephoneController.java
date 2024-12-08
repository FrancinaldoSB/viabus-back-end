package com.viabus.viabus_api.controller;

import org.springframework.web.bind.annotation.*;

import com.viabus.viabus_api.model.Telephone;
import com.viabus.viabus_api.service.TelephoneService;

import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;

@RestController
@RequestMapping("/users/{userId}/phones")
public class TelephoneController {

  @Autowired
  private TelephoneService telephoneService;

  // GET /users/{userId}/phones
  @GetMapping
  public List<Telephone> getPhonesByUserId(@PathVariable Long userId) {
    return telephoneService.getPhonesByUserId(userId);
  }

  // POST /users/{userId}/phones
  @PostMapping
  public Telephone addPhoneToUser(@PathVariable Long userId, @RequestBody Telephone telephone) {
    return telephoneService.addPhoneToUser(userId, telephone);
  }

  // DELETE /users/{userId}/phones/{phoneId}
  @DeleteMapping("/{phoneId}")
  public void deletePhone(@PathVariable Long userId, @PathVariable Long phoneId) {
    telephoneService.deletePhone(userId, phoneId);
  }
}
