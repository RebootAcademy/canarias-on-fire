# Usa una imagen oficial de Node.js como imagen padre, basándose en la versión de .node-version
ARG NODE_VERSION=20.18.1
FROM node:${NODE_VERSION}-slim

# Establece el directorio de trabajo en el contenedor
WORKDIR /usr/src/app/backend

# Instala las dependencias necesarias para Puppeteer
# Estas son librerías del sistema que Chromium necesita
RUN apt-get update && apt-get install -yq     gconf-service     libasound2     libatk1.0-0     libatk-bridge2.0-0     libc6     libcairo2     libcups2     libdbus-1-3     libexpat1     libfontconfig1     libgcc1     libgconf-2-4     libgdk-pixbuf2.0-0     libglib2.0-0     libglib2.0-0     libgtk-3-0     libgbm1     libnspr4     libpango-1.0-0     libpangocairo-1.0-0     libstdc++6     libx11-6     libx11-xcb1     libxcb1     libxcomposite1     libxcursor1     libxdamage1     libxext6     libxfixes3     libxi6     libxrandr2     libxrender1     libxss1     libxtst6     ca-certificates     fonts-liberation     libappindicator1     libnss3     lsb-release     xdg-utils     wget     --no-install-recommends && rm -rf /var/lib/apt/lists/*

# Copia los archivos de definición de dependencias
COPY package.json package-lock.json ./

# Instala las dependencias de producción
RUN npm ci --only=production

# Establece la variable de entorno para el directorio de caché de Puppeteer
ENV PUPPETEER_CACHE_DIR=/usr/src/app/backend/.cache/puppeteer

# Instala el navegador Chrome que Puppeteer necesita
RUN npx puppeteer browsers install chrome

# Copia el resto del código de la aplicación
COPY . .

# Expone el puerto en el que se ejecuta la aplicación
EXPOSE 5000

# Define el comando para ejecutar tu aplicación
CMD [ "npm", "start" ]