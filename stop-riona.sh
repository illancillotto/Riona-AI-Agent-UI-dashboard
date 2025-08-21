#!/bin/bash

# Script per arrestare Riona AI Backend e Frontend Dashboard
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

# Funzione per arrestare servizi per porta
stop_service_by_port() {
    local port=$1
    local service_name=$2
    
    log_info "Ricerca servizi $service_name sulla porta $port..."
    
    # Trova PIDs dei processi sulla porta specifica
    local pids=$(lsof -ti:$port 2>/dev/null)
    
    if [ -z "$pids" ]; then
        log_warning "Nessun servizio $service_name trovato sulla porta $port"
        return 0
    fi
    
    # Arresta ogni processo trovato
    for pid in $pids; do
        log_info "Arresto processo $service_name (PID: $pid)..."
        kill $pid 2>/dev/null || true
        
        # Attesa arresto processo
        local count=0
        while kill -0 $pid 2>/dev/null && [ $count -lt 10 ]; do
            sleep 1
            count=$((count + 1))
        done
        
        # Forza arresto se necessario
        if kill -0 $pid 2>/dev/null; then
            log_warning "Forzatura arresto processo $pid..."
            kill -9 $pid 2>/dev/null || true
        fi
        
        log_success "Processo $service_name (PID: $pid) arrestato"
    done
}

# Funzione per arrestare servizi per nome processo
stop_service_by_name() {
    local service_name=$1
    local process_pattern=$2
    
    log_info "Ricerca processi $service_name..."
    
    # Trova PIDs dei processi per nome
    local pids=$(pgrep -f "$process_pattern" 2>/dev/null)
    
    if [ -z "$pids" ]; then
        log_warning "Nessun processo $service_name trovato"
        return 0
    fi
    
    # Arresta ogni processo trovato
    for pid in $pids; do
        log_info "Arresto processo $service_name (PID: $pid)..."
        kill $pid 2>/dev/null || true
        
        # Attesa arresto processo
        local count=0
        while kill -0 $pid 2>/dev/null && [ $count -lt 10 ]; do
            sleep 1
            count=$((count + 1))
        done
        
        # Forza arresto se necessario
        if kill -0 $pid 2>/dev/null; then
            log_warning "Forzatura arresto processo $pid..."
            kill -9 $pid 2>/dev/null || true
        fi
        
        log_success "Processo $service_name (PID: $pid) arrestato"
    done
}

# Funzione principale
main() {
    echo -e "${BLUE}"
    echo "╔══════════════════════════════════════════════════════════════╗"
    echo "║                 RIONA AI STOPPER                            ║"
    echo "╚══════════════════════════════════════════════════════════════╝"
    echo -e "${NC}"
    
    log_info "Arresto servizi Riona AI..."
    
    # Arresto backend (porta 3099)
    stop_service_by_port 3099 "Backend"
    
    # Arresto frontend (porta 3000)
    stop_service_by_port 3000 "Frontend"
    
    # Arresto processi Node.js specifici per sicurezza
    stop_service_by_name "Node.js Backend" "node.*build/index.js"
    stop_service_by_name "Node.js Frontend" "next.*dev"
    
    # Controllo finale
    log_info "Controllo finale servizi..."
    
    local backend_running=$(lsof -ti:3099 2>/dev/null)
    local frontend_running=$(lsof -ti:3000 2>/dev/null)
    
    if [ -z "$backend_running" ] && [ -z "$frontend_running" ]; then
        log_success "🎉 Tutti i servizi Riona AI sono stati arrestati con successo!"
    else
        log_warning "Alcuni servizi potrebbero essere ancora attivi:"
        if [ ! -z "$backend_running" ]; then
            log_warning "  • Backend ancora attivo (PIDs: $backend_running)"
        fi
        if [ ! -z "$frontend_running" ]; then
            log_warning "  • Frontend ancora attivo (PIDs: $frontend_running)"
        fi
        log_info "Esegui nuovamente lo script per forzare l'arresto"
    fi
    
    echo ""
}

# Esecuzione script
main "$@"
