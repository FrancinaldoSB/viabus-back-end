package com.viabus.viabus_api.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.viabus.viabus_api.model.Address;

@Repository
public interface AddressRepository extends JpaRepository<Address, Long> {
  Address findByUserId(Long userId);
}
