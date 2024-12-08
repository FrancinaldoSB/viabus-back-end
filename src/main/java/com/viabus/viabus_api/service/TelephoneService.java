package com.viabus.viabus_api.service;

import org.springframework.stereotype.Service;

import com.viabus.viabus_api.model.Telephone;
import com.viabus.viabus_api.model.User;
import com.viabus.viabus_api.repository.TelephoneRepository;
import com.viabus.viabus_api.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;

@Service
public class TelephoneService {

  @Autowired
  private TelephoneRepository telephoneRepository;

  @Autowired
  private UserRepository userRepository;

  // Retorna todos os telefones de um usuário específico
  public List<Telephone> getPhonesByUserId(Long userId) {
    return telephoneRepository.findByUserId(userId);
  }

  // Adiciona um telefone a um usuário
  public Telephone addPhoneToUser(Long userId, Telephone telephone) {
    User user = userRepository.findById(userId)
        .orElseThrow(() -> new RuntimeException("User not found"));
    telephone.setUser(user); // Associa o telefone ao usuário
    return telephoneRepository.save(telephone);
  }

  // Remove um telefone específico de um usuário
  public void deletePhone(Long userId, Long phoneId) {
    Telephone telephone = telephoneRepository.findById(phoneId)
        .orElseThrow(() -> new RuntimeException("Phone not found"));
    if (!telephone.getUser().getId().equals(userId)) {
      throw new RuntimeException("Phone does not belong to the user");
    }
    telephoneRepository.delete(telephone);
  }
}