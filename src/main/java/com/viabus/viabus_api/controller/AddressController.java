package com.viabus.viabus_api.controller;

import org.springframework.web.bind.annotation.*;

import com.viabus.viabus_api.model.Address;
import com.viabus.viabus_api.service.AddressService;

import org.springframework.beans.factory.annotation.Autowired;

@RestController
@RequestMapping("/users/{userId}/address")
public class AddressController {

  @Autowired
  private AddressService addressService;

  // GET /users/{userId}/address
  @GetMapping
  public Address getAddressByUserId(@PathVariable Long userId) {
    return addressService.getAddressByUserId(userId);
  }

  // POST /users/{userId}/address
  @PostMapping
  public Address createAddress(@PathVariable Long userId, @RequestBody Address address) {
    return addressService.createAddress(userId, address);
  }

  // PUT /users/{userId}/address
  @PutMapping
  public Address updateAddress(@PathVariable Long userId, @RequestBody Address address) {
    return addressService.updateAddress(userId, address);
  }
}
