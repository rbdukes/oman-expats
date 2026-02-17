# Oman Expat - Deployment Guide

## 🚀 Quick Deploy to Coolify

### Option 1: Deploy using Docker Image

1. **Build and push the Docker image:**

```bash
# Make the script executable
chmod +x deploy.sh

# Build and push to your registry
./deploy.sh \
  --registry registry.example.com \
  --user your-username \
  --password your-password \
  --tag latest \
  --push
```

2. **Configure Coolify:**
   - Go to Coolify Dashboard
   - Create new Service → Docker
   - Enter image: `registry.example.com/oman-expat:latest`
   - Set environment variables (see below)

### Option 2: Deploy using Git Repository

1. **Push code to your Git repository**

2. **Configure Coolify:**
   - Create new Service → Git Repository
   - Connect your repository
   - Set build type: Nixpacks or Dockerfile
   - Set environment variables

## 📋 Environment Variables

Required:
```
DATABASE_URL=file:/app/data/custom.db
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET=your-random-secret-min-32-chars
```

Generate NEXTAUTH_SECRET:
```bash
openssl rand -base64 32
```

## 🔐 Admin Credentials

After deployment, login with:
- **Email:** admin@omanexpat.com
- **Password:** OmanExpat@2024!

⚠️ **Change the password immediately after first login!**

## 📦 Docker Commands

### Build locally:
```bash
docker build -t oman-expat:latest .
```

### Run locally:
```bash
docker run -d \
  -p 3000:3000 \
  -v oman-expat-data:/app/data \
  -e DATABASE_URL=file:/app/data/custom.db \
  -e NEXTAUTH_URL=http://localhost:3000 \
  -e NEXTAUTH_SECRET=your-secret \
  oman-expat:latest
```

### Using docker-compose:
```bash
docker-compose up -d
```

## 🗄️ Database Management

The SQLite database is stored in a Docker volume for persistence.

### Backup database:
```bash
docker cp oman-expat:/app/data ./backup
```

### Restore database:
```bash
docker cp ./backup/data oman-expat:/app/
```

## 🔄 Update Deployment

1. Pull latest changes
2. Run the deploy script again
3. Coolify will automatically pull the new image

## 📊 Monitoring

View logs:
```bash
docker logs -f oman-expat
```

Health check endpoint: `http://your-domain:3000/`

## 🛠 Troubleshooting

### Application won't start:
- Check environment variables are set correctly
- Verify DATABASE_URL path exists
- Check logs: `docker logs oman-expat`

### Database issues:
- Ensure volume is mounted correctly
- Check file permissions on /app/data

### Authentication issues:
- Verify NEXTAUTH_URL matches your domain
- Regenerate NEXTAUTH_SECRET
