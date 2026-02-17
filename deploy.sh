#!/bin/bash

#######################################################################
#                    OMAN EXPAT DEPLOYMENT SCRIPT                     #
#                                                                    #
#  This script builds and deploys the Oman Expat application         #
#  to a Coolify server using Docker.                                 #
#                                                                    #
#  Usage: ./deploy.sh [options]                                      #
#                                                                    #
#  Options:                                                          #
#    --registry URL    Container registry URL (required for push)    #
#    --user USERNAME   Registry username (required for push)         #
#    --password PASS   Registry password (required for push)         #
#    --tag TAG         Image tag (default: latest)                   #
#    --push            Push image to registry after build            #
#    --local           Build and run locally with docker-compose     #
#    --help            Show this help message                        #
#                                                                    #
#######################################################################

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Default values
IMAGE_NAME="oman-expat"
IMAGE_TAG="latest"
PUSH_IMAGE=false
LOCAL_RUN=false
REGISTRY_URL=""
REGISTRY_USER=""
REGISTRY_PASS=""

# Parse arguments
while [[ $# -gt 0 ]]; do
  case $1 in
    --registry)
      REGISTRY_URL="$2"
      shift 2
      ;;
    --user)
      REGISTRY_USER="$2"
      shift 2
      ;;
    --password)
      REGISTRY_PASS="$2"
      shift 2
      ;;
    --tag)
      IMAGE_TAG="$2"
      shift 2
      ;;
    --push)
      PUSH_IMAGE=true
      shift
      ;;
    --local)
      LOCAL_RUN=true
      shift
      ;;
    --help)
      head -20 "$0" | tail -18
      exit 0
      ;;
    *)
      echo -e "${RED}Unknown option: $1${NC}"
      exit 1
      ;;
  esac
done

echo ""
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}          OMAN EXPAT - DEPLOYMENT SCRIPT                  ${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo ""

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
  echo -e "${RED}Error: Docker is not installed. Please install Docker first.${NC}"
  exit 1
fi

# Check if we're in the project directory
if [ ! -f "package.json" ]; then
  echo -e "${RED}Error: package.json not found. Please run this script from the project root.${NC}"
  exit 1
fi

# Local deployment with docker-compose
if [ "$LOCAL_RUN" = true ]; then
  echo -e "${YELLOW}Building and running locally with docker-compose...${NC}"
  
  # Generate a random secret if not set
  if [ -z "$NEXTAUTH_SECRET" ]; then
    export NEXTAUTH_SECRET=$(openssl rand -base64 32)
    echo -e "${GREEN}Generated NEXTAUTH_SECRET: ${NEXTAUTH_SECRET}${NC}"
  fi
  
  docker-compose up -d --build
  
  echo ""
  echo -e "${GREEN}═══════════════════════════════════════════════════════════${NC}"
  echo -e "${GREEN}              LOCAL DEPLOYMENT COMPLETE!                   ${NC}"
  echo -e "${GREEN}═══════════════════════════════════════════════════════════${NC}"
  echo ""
  echo -e "Application running at: ${BLUE}http://localhost:3000${NC}"
  echo ""
  echo -e "${YELLOW}Admin credentials:${NC}"
  echo -e "  Email:    admin@omanexpat.com"
  echo -e "  Password: OmanExpat@2024!"
  echo ""
  echo -e "${RED}⚠️  Change the admin password after first login!${NC}"
  echo ""
  
  # Show logs
  echo -e "${YELLOW}Showing logs (Ctrl+C to exit)...${NC}"
  docker-compose logs -f
  exit 0
fi

# Step 1: Install dependencies
echo -e "${YELLOW}Step 1: Installing dependencies...${NC}"
if command -v bun &> /dev/null; then
  bun install
else
  npm install
fi

# Step 2: Generate Prisma client
echo -e "${YELLOW}Step 2: Generating Prisma client...${NC}"
npx prisma generate

# Step 3: Build the Docker image
echo -e "${YELLOW}Step 3: Building Docker image...${NC}"
echo -e "  Image: ${IMAGE_NAME}:${IMAGE_TAG}"

docker build -t ${IMAGE_NAME}:${IMAGE_TAG} .

if [ $? -ne 0 ]; then
  echo -e "${RED}Error: Docker build failed.${NC}"
  exit 1
fi

echo -e "${GREEN}✓ Docker image built successfully!${NC}"
echo ""

# Step 4: Push to registry (if requested)
if [ "$PUSH_IMAGE" = true ]; then
  if [ -z "$REGISTRY_URL" ] || [ -z "$REGISTRY_USER" ] || [ -z "$REGISTRY_PASS" ]; then
    echo -e "${RED}Error: Registry URL, username, and password are required for pushing.${NC}"
    echo -e "Use: --registry URL --user USERNAME --password PASSWORD --push"
    exit 1
  fi

  echo -e "${YELLOW}Step 4: Pushing to container registry...${NC}"
  
  # Login to registry
  echo "$REGISTRY_PASS" | docker login $REGISTRY_URL -u "$REGISTRY_USER" --password-stdin
  
  if [ $? -ne 0 ]; then
    echo -e "${RED}Error: Docker login failed.${NC}"
    exit 1
  fi
  
  # Tag image for registry
  FULL_IMAGE_NAME="${REGISTRY_URL}/${IMAGE_NAME}:${IMAGE_TAG}"
  docker tag ${IMAGE_NAME}:${IMAGE_TAG} ${FULL_IMAGE_NAME}
  
  # Push image
  docker push ${FULL_IMAGE_NAME}
  
  if [ $? -ne 0 ]; then
    echo -e "${RED}Error: Docker push failed.${NC}"
    exit 1
  fi
  
  echo -e "${GREEN}✓ Image pushed successfully!${NC}"
  echo ""
  echo -e "${BLUE}Image location: ${FULL_IMAGE_NAME}${NC}"
fi

echo ""
echo -e "${GREEN}═══════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}              DEPLOYMENT COMPLETE!                         ${NC}"
echo -e "${GREEN}═══════════════════════════════════════════════════════════${NC}"
echo ""
echo -e "Image: ${BLUE}${IMAGE_NAME}:${IMAGE_TAG}${NC}"
echo ""

if [ "$PUSH_IMAGE" = true ]; then
  echo -e "Next steps for Coolify deployment:"
  echo -e "1. Go to your Coolify dashboard"
  echo -e "2. Create a new service"
  echo -e "3. Select 'Docker' as the source"
  echo -e "4. Enter the image: ${REGISTRY_URL}/${IMAGE_NAME}:${IMAGE_TAG}"
  echo -e "5. Configure environment variables:"
  echo -e "   - DATABASE_URL=file:/app/data/production.db"
  echo -e "   - NEXTAUTH_URL=https://your-domain.com"
  echo -e "   - NEXTAUTH_SECRET=<generate-a-random-secret>"
  echo -e "6. Deploy the service"
  echo ""
fi

echo -e "${YELLOW}Admin credentials (auto-created on first run):${NC}"
echo -e "  Email:    admin@omanexpat.com"
echo -e "  Password: OmanExpat@2024!"
echo ""
echo -e "${RED}⚠️  Change the admin password after first login!${NC}"
echo ""
