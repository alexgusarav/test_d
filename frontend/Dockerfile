FROM node:22-slim AS build
WORKDIR /app
# ARG VITE_APP_PERSIST_KEY
# ENV VITE_APP_PERSIST_KEY=$VITE_APP_PERSIST_KEY
# ARG VITE_API_URL
# ENV VITE_API_URL=$VITE_API_URL
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Production stage
 FROM nginx:stable-alpine
 RUN rm /etc/nginx/conf.d/default.conf
 COPY nginx.conf /etc/nginx/conf.d/default.conf
 COPY --from=build /app/dist /usr/share/nginx/html
 EXPOSE 80
 CMD ["nginx", "-g", "daemon off;"]