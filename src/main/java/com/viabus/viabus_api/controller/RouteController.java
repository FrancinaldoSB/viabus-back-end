package com.viabus.viabus_api.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.viabus.viabus_api.model.Route;
import com.viabus.viabus_api.service.RouteService;

@RestController
@RequestMapping("/routes") // Rota base para o CRUD
public class RouteController {

  @Autowired
  private RouteService routeService;

  // GET /routes - Retorna todas as rotas disponíveis
  @GetMapping
  public List<Route> getRoutes() {
    return routeService.getRoutes();
  }

  // GET /routes/{id} - Retorna informações de uma rota específica
  @GetMapping("/{id}")
  public Route getRouteById(@PathVariable Long id) {
    return routeService.getRouteById(id);
  }

  // POST /routes - Cria uma nova rota
  @PostMapping
  public Route createRoute(@RequestBody Route route) {
    return routeService.createRoute(route);
  }

  // PUT /routes/{id} - Atualiza uma rota
  @PutMapping("/{id}")
  public Route updateRoute(@PathVariable Long id, @RequestBody Route route) {
    return routeService.updateRoute(id, route);
  }

  // DELETE /routes/{id} - Remove uma rota
  @DeleteMapping("/{id}")
  public void deleteRoute(@PathVariable Long id) {
    routeService.deleteRoute(id);
  }
}
