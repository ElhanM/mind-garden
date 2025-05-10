provider "aws" {
  region = var.aws_region
}

# Create a security group
resource "aws_security_group" "mind_garden_sg" {
  name        = "mind-garden-sg"
  description = "Allow traffic for Mind Garden app"

  # SSH access
  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # HTTP access
  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # HTTPS access
  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # Outbound internet access
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# Create an Elastic IP
resource "aws_eip" "mind_garden_eip" {
  domain = "vpc"
  tags = {
    Name = "mind-garden-eip"
  }
}

# Create an EC2 instance
resource "aws_instance" "mind_garden_instance" {
  ami                    = var.ami_id
  instance_type          = var.instance_type
  key_name               = var.key_name
  vpc_security_group_ids = [aws_security_group.mind_garden_sg.id]
  
  user_data = <<-EOF
                #!/bin/bash
                # Install Docker
                apt-get update
                apt-get install -y apt-transport-https ca-certificates curl software-properties-common
                curl -fsSL https://download.docker.com/linux/ubuntu/gpg | apt-key add -
                add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"
                apt-get update
                apt-get install -y docker-ce
                usermod -aG docker ubuntu

                # Install Nginx and Certbot
                apt-get install -y nginx certbot python3-certbot-nginx

                # Install AWS CLI v2
                apt-get install -y unzip
                curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
                unzip awscliv2.zip
                ./aws/install
                
                # Wait a moment for AWS CLI to be available
                sleep 5

                # Get parameters and create .env files
                mkdir -p ./frontend ./backend

                aws ssm get-parameter --name "/mind-garden/frontend/env" --with-decryption --region eu-north-1 --query "Parameter.Value" --output text > ./frontend/.env
                aws ssm get-parameter --name "/mind-garden/backend/env" --with-decryption --region eu-north-1 --query "Parameter.Value" --output text > ./backend/.env

                # Pull images
                docker pull elhanm/mind-garden-backend:latest
                docker pull elhanm/mind-garden-frontend:latest

                # Start containers
                docker network create mind-garden-network

                docker run -d \
                  --name mind-garden-backend \
                  -p 4000:4000 \
                  --env-file ./backend/.env \
                  --restart unless-stopped \
                  --network mind-garden-network \
                  elhanm/mind-garden-backend:latest
                  
                docker run -d \
                  --name mind-garden-frontend \
                  -p 3000:3000 \
                  --env-file ./frontend/.env \
                  --restart unless-stopped \
                  --network mind-garden-network \
                  elhanm/mind-garden-frontend:latest

                # Create Nginx config
                cat > /etc/nginx/sites-available/mind-garden <<'NGINX'
                server {
                  listen 80;
                  server_name mind-garden.hyper6xhurmasice.online;
                  
                  location / {
                      proxy_pass http://localhost:3000;
                      proxy_http_version 1.1;
                      proxy_set_header Upgrade $http_upgrade;
                      proxy_set_header Connection 'upgrade';
                      proxy_set_header Host $host;
                      proxy_cache_bypass $http_upgrade;
                  }
              
                  # NextAuth routes should go to frontend
                  location /api/auth/ {
                      proxy_pass http://localhost:3000;
                      proxy_http_version 1.1;
                      proxy_set_header Upgrade $http_upgrade;
                      proxy_set_header Connection 'upgrade';
                      proxy_set_header Host $host;
                      proxy_cache_bypass $http_upgrade;
                  }
              
                  # All other API routes go to backend
                  location /api/ {
                      proxy_pass http://localhost:4000;
                      proxy_http_version 1.1;
                      proxy_set_header Upgrade $http_upgrade;
                      proxy_set_header Connection 'upgrade';
                      proxy_set_header Host $host;
                      proxy_cache_bypass $http_upgrade;
                  }
                }
                NGINX

                # Enable the Nginx site
                ln -s /etc/nginx/sites-available/mind-garden /etc/nginx/sites-enabled/
                rm /etc/nginx/sites-enabled/default
                nginx -t && systemctl restart nginx

                # Get SSL certificate

                # Check if certificate already exists
                if [ -d "/etc/letsencrypt/live/mind-garden.hyper6xhurmasice.online" ]; then
                  echo "SSL certificate already exists, using existing certificate"
                  certbot renew --quiet
                else
                  # Try to fetch certificate from S3 backup (if exists)
                  if aws s3 ls s3://mind-garden-ssl-backups/ &>/dev/null; then
                    echo "Restoring certificate from backup"
                    aws s3 sync s3://mind-garden-ssl-backups/letsencrypt/ /etc/letsencrypt/
                    certbot renew --quiet
                  else
                    # Only create a new certificate if we don't have one already
                    echo "Requesting new SSL certificate"
                    certbot --nginx -d mind-garden.hyper6xhurmasice.online --non-interactive --agree-tos --email admin@hyper6xhurmasice.online
                    
                    # Backup the new certificate
                    aws s3 sync /etc/letsencrypt/ s3://mind-garden-ssl-backups/letsencrypt/
                  fi
                fi
                EOF

  tags = {
    Name = "mind-garden-instance"
  }
}

# Associate Elastic IP with the EC2 instance
resource "aws_eip_association" "eip_assoc" {
  instance_id   = aws_instance.mind_garden_instance.id
  allocation_id = aws_eip.mind_garden_eip.id
}

output "elastic_ip" {
  value = aws_eip.mind_garden_eip.public_ip
}