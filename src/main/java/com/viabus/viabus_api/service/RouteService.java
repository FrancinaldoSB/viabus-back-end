package com.viabus.viabus_api.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.viabus.viabus_api.model.Route;
import com.viabus.viabus_api.repository.RouteRepository;

@Service
public class RouteService {
  @Autowired
  private RouteRepository routeRepository;

  // Retorna todas as rotas
  public List<Route> getRoutes() {
    return routeRepository.findAll();
  }

  // Retorna uma rota pelo ID
  public Route getRouteById(Long id) {
    return routeRepository.findById(id)
        .orElseThrow(() -> new RuntimeException("Route not found"));
  }

  // Cria uma nova rota
  public Route createRoute(Route route) {
    return routeRepository.save(route);
  }

  // Atualiza uma rota existente
  public Route updateRoute(Long id, Route route) {
    Route existingRoute = routeRepository.findById(id)
        .orElseThrow(() -> new RuntimeException("Route not found"));
    existingRoute.setName(route.getName());
    existingRoute.setDistance(route.getDistance());
    existingRoute.setDuration(route.getDuration());
    existingRoute.setUser(route.getUser());
    return routeRepository.save(existingRoute);
  }

  // Remove uma rota
  public void deleteRoute(Long id) {
    Route route = routeRepository.findById(id)
        .orElseThrow(() -> new RuntimeException("Route not found"));
    routeRepository.delete(route);
  }
}
