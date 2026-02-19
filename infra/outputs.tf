output "app_url" {
  description = "Application URL"
  value       = "http://localhost:${var.frontend_port}"
}

output "mongo_url" {
  description = "MongoDB URL"
  value       = "mongodb://localhost:27017"
}

output "app_container_id" {
  description = "App container ID"
  value       = docker_container.app.id
}

output "mongo_container_id" {
  description = "MongoDB container ID"
  value       = docker_container.mongo.id
}
