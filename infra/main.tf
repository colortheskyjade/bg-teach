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

# Backend image
resource "docker_image" "backend" {
  name = "${var.project_name}-backend:${var.image_tag}"
  build {
    context    = "${path.module}/.."
    dockerfile = "packages/backend/Dockerfile"
    tag        = ["${var.project_name}-backend:${var.image_tag}"]
  }
}

# Frontend image
resource "docker_image" "frontend" {
  name = "${var.project_name}-frontend:${var.image_tag}"
  build {
    context    = "${path.module}/.."
    dockerfile = "packages/frontend/Dockerfile"
    tag        = ["${var.project_name}-frontend:${var.image_tag}"]
  }
}

# Backend container
resource "docker_container" "backend" {
  name  = "${var.project_name}-backend"
  image = docker_image.backend.image_id

  ports {
    internal = 3001
    external = var.backend_port
  }

  env = [
    "NODE_ENV=production",
    "PORT=3001"
  ]

  networks_advanced {
    name = docker_network.bg_teach.name
  }

  restart = "unless-stopped"
}

# Frontend container
resource "docker_container" "frontend" {
  name  = "${var.project_name}-frontend"
  image = docker_image.frontend.image_id

  ports {
    internal = 3000
    external = var.frontend_port
  }

  env = [
    "NODE_ENV=production",
    "NEXT_PUBLIC_API_URL=http://${docker_container.backend.name}:3001"
  ]

  networks_advanced {
    name = docker_network.bg_teach.name
  }

  depends_on = [docker_container.backend]

  restart = "unless-stopped"
}
