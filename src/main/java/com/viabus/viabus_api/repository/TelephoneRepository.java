package com.viabus.viabus_api.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.viabus.viabus_api.model.Telephone;

import java.util.List;

@Repository
public interface TelephoneRepository extends JpaRepository<Telephone, Long> {
  List<Telephone> findByUserId(Long userId);
}
