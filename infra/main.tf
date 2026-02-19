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

# MongoDB image
resource "docker_image" "mongo" {
  name = "mongo:latest"
}

# MongoDB container
resource "docker_container" "mongo" {
  name  = "${var.project_name}-mongo"
  image = docker_image.mongo.image_id
  
  networks_advanced {
    name = docker_network.bg_teach.name
  }

  ports {
    internal = 27017
    external = 27017
  }

  volumes {
    container_path = "/data/db"
    volume_name    = docker_volume.mongo_data.name
  }

  restart = "unless-stopped"
}

resource "docker_volume" "mongo_data" {
  name = "${var.project_name}-mongo-data"
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
    "PORT=3000",
    "MONGODB_URI=mongodb://${var.project_name}-mongo:27017/bg-teach"
  ]

  networks_advanced {
    name = docker_network.bg_teach.name
  }

  depends_on = [docker_container.mongo]

  restart = "unless-stopped"
}
