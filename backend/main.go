package main

import (
	"database/sql"
	"encoding/json"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/joho/godotenv"
	_ "github.com/lib/pq"
)

// Response structure for consistent API responses
type Response struct {
	Status    string      `json:"status"`
	Message   string      `json:"message"`
	Data      interface{} `json:"data,omitempty"`
	Timestamp int64       `json:"timestamp"`
}

// Global DB connection for efficiency (God Mode Requirement)
var db *sql.DB

func init() {
	// Load .env from root or current directory
	godotenv.Load("../.env")
	godotenv.Load(".env")
}

func connectDB() {
	dbURL := os.Getenv("DATABASE_URL")
	if dbURL == "" {
		log.Println("⚠️ DATABASE_URL not set, running in limited mode")
		return
	}

	var err error
	db, err = sql.Open("postgres", dbURL)
	if err != nil {
		log.Printf("❌ Database connection error: %v", err)
		return
	}

	db.SetMaxOpenConns(25)
	db.SetMaxIdleConns(5)
	db.SetConnMaxLifetime(5 * time.Minute)

	if err = db.Ping(); err != nil {
		log.Printf("❌ Database ping failed: %v", err)
	} else {
		log.Println("✅ Database connected successfully")
	}
}

func main() {
	connectDB()
	defer func() {
		if db != nil {
			db.Close()
		}
	}()

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	// Route Handlers
	http.HandleFunc("/health", healthHandler)
	http.HandleFunc("/api/v1/status", statusHandler)
	http.HandleFunc("/api/v1/trigger", triggerHandler)
	
	// AI Fallback / Proxy Layer
	http.HandleFunc("/v1/chat/completions", aiProxyHandler)

	log.Printf("🚀 [GOD MODE] DRKCNAY Elite GTM-Backend starting on port %s...", port)
	server := &http.Server{
		Addr:         ":" + port,
		ReadTimeout:  10 * time.Second,
		WriteTimeout: 10 * time.Second,
	}

	if err := server.ListenAndServe(); err != nil {
		log.Fatal(err)
	}
}

func healthHandler(w http.ResponseWriter, r *http.Request) {
	sendJSON(w, http.StatusOK, Response{
		Status:    "OK",
		Message:   "DRKCNAY Elite GTM-Backend Active",
		Timestamp: time.Now().Unix(),
	})
}

func statusHandler(w http.ResponseWriter, r *http.Request) {
	// Query database for system status if DB is connected
	var userCount int
	var botCount int
	
	if db != nil {
		db.QueryRow("SELECT COUNT(*) FROM \"User\"").Scan(&userCount)
		// Assuming a 'Bot' or similar table exists in your Prisma schema
		// db.QueryRow("SELECT COUNT(*) FROM \"BotState\"").Scan(&botCount)
	}

	sendJSON(w, http.StatusOK, Response{
		Status:  "Active",
		Message: "System Health Summary",
		Data: map[string]interface{}{
			"db_connected": db != nil,
			"users":        userCount,
			"bots_active":  botCount,
			"uptime":       time.Since(time.Unix(time.Now().Unix(), 0)).String(), // Simplified
		},
		Timestamp: time.Now().Unix(),
	})
}

func triggerHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		w.WriteHeader(http.StatusMethodNotAllowed)
		return
	}
	// Logic to trigger specific scripts via internal signals or DB flags
	sendJSON(w, http.StatusAccepted, Response{
		Status:    "Processing",
		Message:   "DRKCNAY Orchestrator notified of trigger event",
		Timestamp: time.Now().Unix(),
	})
}

func aiProxyHandler(w http.ResponseWriter, r *http.Request) {
	log.Printf("📡 AI Fallback Request received: %s", r.Method)
	sendJSON(w, http.StatusServiceUnavailable, Response{
		Status:    "Offline",
		Message:   "AI Fallback Layer Active - Awaiting Logic Injection",
		Timestamp: time.Now().Unix(),
	})
}

func sendJSON(w http.ResponseWriter, status int, payload interface{}) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	json.NewEncoder(w).Encode(payload)
}
