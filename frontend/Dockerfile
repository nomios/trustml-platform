# Build stage
FROM node:20-alpine AS build
WORKDIR /app
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* .npmrc* ./
RUN if [ -f yarn.lock ]; then yarn install --frozen-lockfile; \
    elif [ -f package-lock.json ]; then npm ci --legacy-peer-deps; \
    elif [ -f pnpm-lock.yaml ]; then npm i -g pnpm && pnpm install --frozen-lockfile; \
    else npm install --legacy-peer-deps; fi
COPY . .
RUN npm run build

# Serve stage
FROM nginx:alpine
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

# Use the official MongoDB image as the base
FROM mongo:latest

# Set up environment variables for MongoDB (optional)
# ENV MONGO_INITDB_ROOT_USERNAME=admin
#ENV MONGO_INITDB_ROOT_PASSWORD=secret

# Copy any custom initialization scripts (optional)
# COPY ./init-scripts /docker-entrypoint-initdb.d/

# Expose the default MongoDB port
EXPOSE 27017




