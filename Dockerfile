FROM node:20-alpine AS base
WORKDIR /app
COPY package*.json yarn.lock ./ 
RUN npm install
COPY . .

FROM base as builder
WORKDIR /app
RUN npm run build

FROM node:20-alpine AS final
WORKDIR /app
COPY package*.json yarn.lock ./ 
ENV NODE_ENV="production"
RUN npm install
COPY --from=builder ./app/dist ./dist
CMD [ "npm", "start" ]