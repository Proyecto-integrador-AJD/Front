#!/bin/bash

# Configuración
SERVER="frontend@44.215.212.155"
REMOTE_PATH="/var/www/frontend/html"
REPO_URL="git@github.com:Proyecto-integrador-AJD/Front.git"
BRANCH="Deployer"

# Conectar al servidor y ejecutar los comandos
ssh $SERVER << EOF
  echo "Conectado al servidor..."
  
  # Crear la ruta si no existe
  mkdir -p $REMOTE_PATH
  cd $REMOTE_PATH
  
  # Clonar el repositorio si no existe, o hacer pull si ya está
  if [ ! -d ".git" ]; then
    echo "Clonando el repositorio..."
    git clone -b $BRANCH $REPO_URL .
  else
    echo "Actualizando el repositorio..."
    git pull origin $BRANCH
  fi
  
  # Instalar dependencias y construir
  echo "Instalando dependencias..."
  npm install
  
  echo "Compilando la aplicación..."
  npm run build
  
  echo "Despliegue completado."
EOF
