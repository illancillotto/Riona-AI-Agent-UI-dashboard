#!/bin/bash

# Script per riavviare Riona AI Backend e Frontend Dashboard
# Autore: Riona AI Team
# Versione: 1.0

# Colori per output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Funzione per logging colorato
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Funzione principale
main() {
    echo -e "${BLUE}"
    echo "╔══════════════════════════════════════════════════════════════╗"
    echo "║                RIONA AI RESTARTER                            ║"
    echo "╚══════════════════════════════════════════════════════════════╝"
    echo -e "${NC}"
    
    log_info "Riavvio servizi Riona AI..."
    
    # Controllo se gli script esistono
    if [ ! -f "./stop-riona.sh" ]; then
        log_error "Script stop-riona.sh non trovato"
        exit 1
    fi
    
    if [ ! -f "./start-riona.sh" ]; then
        log_error "Script start-riona.sh non trovato"
        exit 1
    fi
    
    # Arresto servizi
    log_info "Fase 1: Arresto servizi..."
    ./stop-riona.sh
    
    # Attesa per assicurarsi che i servizi siano completamente arrestati
    log_info "Attesa completamento arresto..."
    sleep 3
    
    # Avvio servizi
    log_info "Fase 2: Avvio servizi..."
    ./start-riona.sh
}

# Esecuzione script
main "$@"
