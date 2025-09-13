#!/bin/bash
# Docker deployment for VPN Backoffice

docker build -f docker/Dockerfile -t vpn-backoffice .
docker run -p 3000:3000 -e NEXT_PUBLIC_API_BASE_URL=http://localhost:8000 vpn-backoffice