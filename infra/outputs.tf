output "backend_url" {
  description = "Backend API URL"
  value       = "http://localhost:${var.backend_port}"
}

output "frontend_url" {
  description = "Frontend URL"
  value       = "http://localhost:${var.frontend_port}"
}

output "backend_container_id" {
  description = "Backend container ID"
  value       = docker_container.backend.id
}

output "frontend_container_id" {
  description = "Frontend container ID"
  value       = docker_container.frontend.id
}
