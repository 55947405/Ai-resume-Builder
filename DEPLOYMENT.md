# 🚀 AWS Deployment & Docker Setup

This project was deployed using AWS Cloud and containerized using Docker.

## 🏗️ Infrastructure Setup
- Created custom VPC with public and private subnets
- Configured security groups for controlled access
- Deployed frontend on public EC2 instance
- Deployed backend on private EC2 instance

## 🐳 Docker Implementation
- Containerized frontend using Docker
- Containerized backend services
- Managed containers on EC2 instances

## 🌐 Reverse Proxy (Nginx)
- Configured Nginx as reverse proxy
- Routed traffic:
  - `/` → Frontend
  - `/api` → Backend

## 🗄️ Database Integration
- Connected backend with MongoDB Atlas (cloud database)

## 🔐 Networking
- Enabled private communication between frontend and backend using private IP
- Backend secured inside private subnet

## 📌 Contribution
- AWS Infrastructure setup
- Docker containerization
- Nginx configuration
- Deployment and networking
