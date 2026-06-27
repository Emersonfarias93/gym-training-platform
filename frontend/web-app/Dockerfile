FROM node:20-alpine AS build

WORKDIR /app

ARG NEXT_PUBLIC_ENABLE_MOCK_CHECKOUT=false
ENV NEXT_PUBLIC_ENABLE_MOCK_CHECKOUT=${NEXT_PUBLIC_ENABLE_MOCK_CHECKOUT}

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM node:20-alpine

WORKDIR /app

COPY --from=build /app ./

EXPOSE 3000

CMD ["npm", "start"]