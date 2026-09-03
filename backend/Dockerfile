FROM node:20-alpine
WORKDIR /opt/backend
COPY package.json package-lock.json .
RUN npm ci --omit=dev
COPY *.js .
ENV DB_HOST="mysql"
CMD ["node","index.js"]