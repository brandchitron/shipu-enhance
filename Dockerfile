# Use official Python slim image
FROM python:3.8-slim

# Install system dependencies for OpenCV and build tools
RUN apt-get update && apt-get install -y \
    build-essential \
    ffmpeg \
    libsm6 \
    libxext6 \
    git \
    curl \
    nodejs \
    npm

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

# Install node dependencies
RUN npm install

# Copy Python requirements
COPY requirements.txt .

# Install Python dependencies
RUN pip install --upgrade pip
RUN pip install torch==2.0.1+cpu -f https://download.pytorch.org/whl/cpu/torch_stable.html
RUN pip install -r requirements.txt

# Copy all source files
COPY . .

# Expose port (make sure your app listens on $PORT)
ENV PORT=10000
EXPOSE 10000

# Start your node server
CMD ["node", "server/index.js"]
