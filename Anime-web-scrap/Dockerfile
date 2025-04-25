# Use an official Node.js image with Python installed
FROM node:18-bullseye

# Install Python and pip
RUN apt-get update && apt-get install -y python3 python3-pip

# Set working directory
WORKDIR /app

# Copy package files and Python requirements
COPY package.json ./
COPY requirements.txt ./

# Install Node.js dependencies (will trigger postinstall)
RUN npm install

# Install Python dependencies (if not handled by postinstall)
# RUN pip3 install -r requirements.txt

# Copy the rest of the code
COPY . .

# Expose the port your app runs on
EXPOSE 3000

# Start the Node.js app
CMD ["node", "src/index.js"]