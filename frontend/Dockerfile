FROM node:18-alpine AS build
WORKDIR /app
COPY package.json ./
COPY package-lock.json ./

RUN npm install
COPY . .

RUN npm run build

# nginx
FROM nginx:stable-alpine

COPY --from=build /app/build /usr/share/nginx/html
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]