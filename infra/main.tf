terraform {
  required_version = ">= 1.0"

  required_providers {
    docker = {
      source  = "kreuzwerker/docker"
      version = "~> 3.0"
    }
  }
}

provider "docker" {
  host = var.docker_host
}

# Docker network for services
resource "docker_network" "bg_teach" {
  name = "${var.project_name}-network"
}

# App image
resource "docker_image" "app" {
  name = "${var.project_name}:${var.image_tag}"
  build {
    context    = "${path.module}/.."
    dockerfile = "Dockerfile"
    tag        = ["${var.project_name}:${var.image_tag}"]
  }
}

# App container
resource "docker_container" "app" {
  name  = var.project_name
  image = docker_image.app.image_id

  ports {
    internal = 3000
    external = var.frontend_port
  }

  env = [
    "NODE_ENV=production",
    "PORT=3000"
  ]

  networks_advanced {
    name = docker_network.bg_teach.name
  }

  restart = "unless-stopped"
}
