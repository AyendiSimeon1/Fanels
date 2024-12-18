FROM node:16
WORKDIR /app
COPY package*.json ./
RUN yarn instal
COPY . .
EXPOSE 3000
CMD ["yarn", "run", "dev"]