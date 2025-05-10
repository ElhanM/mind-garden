# Build stage
FROM node:22.13.1-slim AS builder
WORKDIR /app
RUN npm install -g npm@10.9.2
COPY package.json ./
RUN npm install
COPY . .
RUN npm run build

# Runtime stage
FROM node:22.13.1-slim
WORKDIR /app
COPY --from=builder /app/package-lock.json ./package-lock.json
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.mjs ./next.config.mjs
EXPOSE 3000
CMD ["npm", "start"]