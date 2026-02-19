variable "project_name" {
  description = "Name of the project"
  type        = string
  default     = "bg-teach"
}

variable "docker_host" {
  description = "Docker host URL"
  type        = string
  default     = "unix:///var/run/docker.sock"
}

variable "image_tag" {
  description = "Tag for Docker images"
  type        = string
  default     = "latest"
}

variable "backend_port" {
  description = "External port for backend service"
  type        = number
  default     = 3001
}

variable "frontend_port" {
  description = "External port for frontend service"
  type        = number
  default     = 3000
}
