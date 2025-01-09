package com.viabus.viabus_api.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.viabus.viabus_api.model.Route;

@Repository
public interface RouteRepository extends JpaRepository<Route, Long> {

}
