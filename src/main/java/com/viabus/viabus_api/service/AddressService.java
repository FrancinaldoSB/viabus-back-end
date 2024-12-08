package com.viabus.viabus_api.service;

import org.springframework.stereotype.Service;

import com.viabus.viabus_api.model.Address;
import com.viabus.viabus_api.repository.AddressRepository;

import org.springframework.beans.factory.annotation.Autowired;

import com.viabus.viabus_api.model.User;
import com.viabus.viabus_api.repository.UserRepository;

@Service
public class AddressService {

  @Autowired
  private AddressRepository addressRepository;

  @Autowired
  private UserRepository userRepository;

  public Address getAddressByUserId(Long userId) {
    return addressRepository.findByUserId(userId);
  }

  public Address createAddress(Long userId, Address address) {
    User user = userRepository.findById(userId)
        .orElseThrow(() -> new RuntimeException("User not found"));
    address.setUser(user); // Associa o endereço ao usuário
    return addressRepository.save(address);
  }

  public Address updateAddress(Long userId, Address updatedAddress) {
    Address address = getAddressByUserId(userId);
    address.setStreet(updatedAddress.getStreet());
    address.setCityName(updatedAddress.getCityName());
    // Atualize os outros campos conforme necessário
    return addressRepository.save(address);
  }
}
