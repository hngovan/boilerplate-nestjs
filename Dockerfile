# Development stage
FROM node:22-alpine AS development

# Set the working directory inside the container
WORKDIR /usr/src/app

ENV NODE_ENV=development

# Copy dependent files and install
COPY package.json yarn.lock ./

# Install the application dependencies
RUN yarn install --frozen-lockfile && yarn cache clean

# Copy the rest of the application files
COPY . .

# Build the NestJS application
RUN yarn run build

# Run the application
CMD ["yarn", "run", "start:dev"]

# Production stage
FROM node:22-alpine AS production

ARG NODE_ENV=production

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy necessary files from development stage
COPY --from=development /usr/src/app/package.json ./
COPY --from=development /usr/src/app/yarn.lock ./
COPY --from=development /usr/src/app/dist ./dist

# Install only dependencies needed for production
RUN yarn install --frozen-lockfile && yarn cache clean

# Run the application
CMD [ "node", "dist/main" ]