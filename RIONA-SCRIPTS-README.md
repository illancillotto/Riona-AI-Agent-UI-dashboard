# 🚀 Script di Gestione Riona AI

Questo pacchetto contiene script automatizzati per gestire facilmente i servizi **Riona AI Backend** e **Riona AI Dashboard Frontend**.

## 📁 File Inclusi

- **`start-riona.sh`** - Avvia backend e frontend contemporaneamente
- **`stop-riona.sh`** - Arresta tutti i servizi in modo pulito
- **`restart-riona.sh`** - Riavvia tutti i servizi
- **`RIONA-SCRIPTS-README.md`** - Questa documentazione

## 🎯 Prerequisiti

- **Linux/macOS** (testato su Ubuntu 20.04+)
- **Node.js** versione 18+ (raccomandato)
- **npm** installato
- **Bash shell**

## 🚀 Utilizzo

### 1. Avvio Servizi
```bash
./start-riona.sh
```

**Cosa fa:**
- ✅ Controlla prerequisiti (Node.js, npm)
- ✅ Installa dipendenze se necessario
- ✅ Compila TypeScript backend
- ✅ Avvia backend su porta 3099
- ✅ Avvia frontend su porta 3050
- ✅ Monitora lo stato dei servizi
- ✅ Gestisce arresto pulito con Ctrl+C

**Output:**
```
╔══════════════════════════════════════════════════════════════╗
║                    RIONA AI LAUNCHER                        ║
║                                                              ║
║  Backend:  http://localhost:3099                            ║
║  Frontend: http://localhost:3050                            ║
╚══════════════════════════════════════════════════════════════╝

🎉 Riona AI è ora in esecuzione!

Servizi attivi:
  • Backend:  http://localhost:3099
  • Frontend: http://localhost:3050

Premi Ctrl+C per arrestare tutti i servizi
```

### 2. Arresto Servizi
```bash
./stop-riona.sh
```

**Cosa fa:**
- 🔍 Trova processi attivi per porta e nome
- 🛑 Arresta backend (porta 3099)
- 🛑 Arresta frontend (porta 3050)
- ⚠️ Forza arresto se necessario
- ✅ Conferma arresto completo

### 3. Riavvio Servizi
```bash
./restart-riona.sh
```

**Cosa fa:**
- 🛑 Arresta tutti i servizi
- ⏳ Attende completamento arresto
- 🚀 Riavvia tutti i servizi
- ✅ Monitora stato

## 🔧 Configurazione

### Variabili d'Ambiente
- **`PORT`** - Porta backend (default: 3099)
- **`NODE_ENV`** - Ambiente Node.js

### Personalizzazione Porte
```bash
# Cambia porta backend
PORT=4000 ./start-riona.sh

# Cambia porta frontend (modifica start-riona.sh)
```

## 📊 Monitoraggio

### Controllo Stato Servizi
```bash
# Controlla porte attive
lsof -i :3099  # Backend
lsof -i :3050  # Frontend

# Controlla processi Node.js
ps aux | grep node
```

### Log e Debug
- **Backend**: Output nel terminale con timestamp
- **Frontend**: Output Next.js nel terminale
- **Errori**: Gestione automatica e logging colorato

## 🚨 Risoluzione Problemi

### Servizio Non Si Avvia
1. Controlla prerequisiti: `node --version`, `npm --version`
2. Verifica dipendenze: `npm install` nella directory corretta
3. Controlla porte libere: `lsof -i :3099` e `lsof -i :3050`
4. Verifica file di configurazione

### Porta Già in Uso
```bash
# Trova processo sulla porta
lsof -i :3099

# Arresta processo
kill -9 <PID>

# Oppure usa script di arresto
./stop-riona.sh
```

### Dipendenze Mancanti
```bash
# Reinstalla dipendenze backend
npm install

# Reinstalla dipendenze frontend
cd riona-dashboard && npm install
```

## 🔒 Sicurezza

- **Gestione segnali**: SIGINT, SIGTERM gestiti correttamente
- **Pulizia processi**: Arresto pulito senza processi zombie
- **Controllo permessi**: Script eseguibili solo per utente autorizzato
- **Isolamento**: Ogni servizio in processo separato

## 📝 Note Tecniche

### Architettura Script
```
start-riona.sh
├── Controllo prerequisiti
├── Installazione dipendenze
├── Avvio backend (background)
├── Avvio frontend (background)
└── Monitoraggio continuo

stop-riona.sh
├── Ricerca processi per porta
├── Ricerca processi per nome
├── Arresto graduale
└── Forzatura se necessario
```

### Gestione Processi
- **Backend PID**: Salvato in `$BACKEND_PID`
- **Frontend PID**: Salvato in `$FRONTEND_PID`
- **Monitoraggio**: Controllo ogni 5 secondi
- **Cleanup**: Gestione automatica alla chiusura

## 🤝 Contributi

Per migliorare questi script:
1. Testa su diverse distribuzioni Linux
2. Verifica compatibilità con diverse versioni Node.js
3. Aggiungi nuove funzionalità di monitoraggio
4. Migliora gestione errori e logging

## 📞 Supporto

In caso di problemi:
1. Controlla la sezione "Risoluzione Problemi"
2. Verifica i log di output
3. Controlla lo stato dei servizi
4. Riavvia con `./restart-riona.sh`

---

**Riona AI Team** - Automazione intelligente per social media 🤖✨
