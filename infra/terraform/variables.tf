variable "aws_region" {
  description = "AWS region"
  default     = "eu-north-1"
}

variable "ami_id" {
  description = "AMI ID for Ubuntu 22.04"
  default     = "ami-0c1ac8a41498c1a9c" # Ubuntu 22.04 in eu-north-1
}

variable "instance_type" {
  description = "EC2 instance type"
  default     = "t3.small"
}

variable "key_name" {
  description = "SSH key name for EC2 instance"
  type        = string
  default     = "mind-garden-key"
}