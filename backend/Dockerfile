FROM node:20-alpine
WORKDIR /opt/backend
COPY package.json .
RUN npm install --omit=dev
COPY *.js .
ENV DB_HOST="mysql"
CMD ["node","index.js"]