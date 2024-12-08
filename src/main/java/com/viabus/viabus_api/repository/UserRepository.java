package com.viabus.viabus_api.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.viabus.viabus_api.model.User;

public interface UserRepository extends JpaRepository<User, Long> {

}