#!/bin/bash

cd "$(dirname "$0")"

# Destroy Terraform resources with key_name variable
terraform destroy -auto-approve -var="key_name=mind-garden-key"

echo "Infra destroyed successfully!"
echo "Run ./deploy.sh to recreate."