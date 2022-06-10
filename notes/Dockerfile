FROM node:14.19.3
WORKDIR /usr/app
COPY ./package*.json ./
RUN npm install
COPY ./ ./
CMD ["npm", "start"]
EXPOSE 8000
