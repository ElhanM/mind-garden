#!/bin/bash

cd "$(dirname "$0")"

# Initialize Terraform
terraform init

# Apply Terraform configuration with key_name variable
terraform apply -auto-approve -var="key_name=mind-garden-key"

# Get the Elastic IP
ELASTIC_IP=$(terraform output -raw elastic_ip)
echo "Your Mind Garden app is being deployed to: $ELASTIC_IP"
echo "Wait a few minutes for the instance to initialize, then you can access:"
echo "- Frontend: http://$ELASTIC_IP:3000"
echo "- Backend: http://$ELASTIC_IP:4000"