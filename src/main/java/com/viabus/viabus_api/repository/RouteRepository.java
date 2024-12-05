package com.viabus.viabus_api.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.viabus.viabus_api.model.Route;

public interface RouteRepository extends JpaRepository<Route, Long> {
  
}
