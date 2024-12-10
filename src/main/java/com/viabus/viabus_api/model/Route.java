package com.viabus.viabus_api.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotEmpty;

@Entity
@Table(name = "routes")
public class Route {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @NotEmpty(message = "Nome não pode ser vazio")
  private String name;

  @NotEmpty(message = "A distância não pode ser vazia")
  private Double distance;

  @NotEmpty(message = "A duração não pode ser vazia")
  private Double duration;

  // construtor padrão para o JPA. Ele serve para estanciar as entidades no banco de dados.
  public Route() {}

  // construtor com os atributos da classe. Serve para instanciar objetos da classe.
  public Route(String name, Double distance, Double duration) {
    this.name = name;
    this.distance = distance;
    this.duration = duration;
  }

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public Double getDistance() {
    return distance;
  }

  public void setDistance(Double distance) {
    this.distance = distance;
  }

  public Double getDuration() {
    return duration;
  }

  public void setDuration(Double duration) {
    this.duration = duration;
  }
}
