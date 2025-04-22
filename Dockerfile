# Build ts files into js application ##
FROM node:22-alpine AS build

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .

# Build the application with increased memory limit
ENV NODE_OPTIONS="--max-old-space-size=4096"
RUN npm run build


## Build image with already prepared js application ##
FROM node:22-alpine

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install --omit=dev

# Copy built js application from temporary image
COPY --from=build /usr/src/app/dist ./dist

# # Copy built js application from local project. Run `npm run build` before image build.
# COPY ./dist ./dist

EXPOSE 3000

CMD ["node", "dist/main"]
