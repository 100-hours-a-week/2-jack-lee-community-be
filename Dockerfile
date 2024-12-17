# Use the official Nginx image as the base image
FROM nginx:latest

# Copy custom configuration file to the container
# Uncomment the following line if you have a custom configuration file
# COPY ./nginx.conf /etc/nginx/nginx.conf

# Copy website files to the default Nginx HTML directory
# Uncomment the following line if you have static files to serve
# COPY ./html /usr/share/nginx/html

# Expose port 80 for HTTP traffic
EXPOSE 80

# Start Nginx (default CMD from the base image)
CMD ["nginx", "-g", "daemon off;"]