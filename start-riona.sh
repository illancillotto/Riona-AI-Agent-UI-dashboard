#!/bin/bash

# Script per avviare Riona AI Backend e Frontend Dashboard
# Autore: Riona AI Team
# Versione: 1.0

set -e

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

# Funzione per pulizia alla chiusura
cleanup() {
    log_info "Arresto dei servizi..."
    
    if [ ! -z "$BACKEND_PID" ]; then
        log_info "Arresto backend (PID: $BACKEND_PID)..."
        kill $BACKEND_PID 2>/dev/null || true
    fi
    
    if [ ! -z "$FRONTEND_PID" ]; then
        log_info "Arresto frontend (PID: $FRONTEND_PID)..."
        kill $FRONTEND_PID 2>/dev/null || true
    fi
    
    log_success "Tutti i servizi sono stati arrestati"
    exit 0
}

# Gestione segnali di interruzione
trap cleanup SIGINT SIGTERM

# Controllo prerequisiti
check_prerequisites() {
    log_info "Controllo prerequisiti..."
    
    # Controllo Node.js
    if ! command -v node &> /dev/null; then
        log_error "Node.js non è installato. Installalo prima di continuare."
        exit 1
    fi
    
    # Controllo npm
    if ! command -v npm &> /dev/null; then
        log_error "npm non è installato. Installalo prima di continuare."
        exit 1
    fi
    
    # Controllo versione Node.js (richiede versione 18+)
    NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -lt 18 ]; then
        log_warning "Node.js versione $NODE_VERSION rilevata. Si consiglia la versione 18+ per prestazioni ottimali."
    fi
    
    log_success "Prerequisiti verificati"
}

# Installazione dipendenze
install_dependencies() {
    log_info "Installazione dipendenze backend..."
    npm install
    
    log_info "Installazione dipendenze frontend..."
    cd riona-dashboard
    npm install
    cd ..
    
    log_success "Dipendenze installate"
}

# Avvio backend
start_backend() {
    log_info "Avvio backend Riona AI..."
    
    # Compilazione TypeScript
    log_info "Compilazione TypeScript..."
    npm run start &
    BACKEND_PID=$!
    
    # Attesa avvio backend
    log_info "Attesa avvio backend..."
    sleep 5
    
    # Controllo se il backend è attivo
    if kill -0 $BACKEND_PID 2>/dev/null; then
        log_success "Backend avviato con successo (PID: $BACKEND_PID)"
        log_info "Backend disponibile su: http://localhost:${PORT:-3099}"
    else
        log_error "Errore nell'avvio del backend"
        exit 1
    fi
}

# Avvio frontend
start_frontend() {
    log_info "Avvio frontend Riona Dashboard..."
    
    cd riona-dashboard
    npm run dev &
    FRONTEND_PID=$!
    cd ..
    
    # Attesa avvio frontend
    log_info "Attesa avvio frontend..."
    sleep 3
    
    # Controllo se il frontend è attivo
    if kill -0 $FRONTEND_PID 2>/dev/null; then
        log_success "Frontend avviato con successo (PID: $FRONTEND_PID)"
        log_info "Frontend disponibile su: http://localhost:3050"
    else
        log_error "Errore nell'avvio del frontend"
        exit 1
    fi
}

# Funzione principale
main() {
    echo -e "${BLUE}"
    echo "╔══════════════════════════════════════════════════════════════╗"
    echo "║                    RIONA AI LAUNCHER                        ║"
    echo "║                                                              ║"
    echo "║  Backend:  http://localhost:${PORT:-3099}                    ║"
    echo "║  Frontend: http://localhost:3050                            ║"
    echo "╚══════════════════════════════════════════════════════════════╝"
    echo -e "${NC}"
    
    # Controllo se siamo nella directory corretta
    if [ ! -f "package.json" ] || [ ! -d "riona-dashboard" ]; then
        log_error "Esegui questo script dalla directory root del progetto Riona AI"
        exit 1
    fi
    
    # Controllo prerequisiti
    check_prerequisites
    
    # Controllo se le dipendenze sono già installate
    if [ ! -d "node_modules" ] || [ ! -d "riona-dashboard/node_modules" ]; then
        log_warning "Dipendenze non trovate. Installazione in corso..."
        install_dependencies
    fi
    
    # Avvio servizi
    start_backend
    start_frontend
    
    echo ""
    log_success "🎉 Riona AI è ora in esecuzione!"
    echo ""
    echo -e "${BLUE}Servizi attivi:${NC}"
    echo -e "  • Backend:  ${GREEN}http://localhost:${PORT:-3099}${NC}"
    echo -e "  • Frontend: ${GREEN}http://localhost:3050${NC}"
    echo ""
    echo -e "${YELLOW}Premi Ctrl+C per arrestare tutti i servizi${NC}"
    echo ""
    
    # Mantieni lo script attivo e monitora i processi
    while true; do
        # Controllo se i processi sono ancora attivi
        if ! kill -0 $BACKEND_PID 2>/dev/null; then
            log_error "Backend si è arrestato inaspettatamente"
            break
        fi
        
        if ! kill -0 $FRONTEND_PID 2>/dev/null; then
            log_error "Frontend si è arrestato inaspettatamente"
            break
        fi
        
        sleep 5
    done
    
    cleanup
}

# Esecuzione script
main "$@"
