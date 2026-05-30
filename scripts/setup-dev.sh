#!/usr/bin/env bash
set -euo pipefail

# ============================================================
# Taka Inside - Local Development Setup Script
# ============================================================

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

info() { echo -e "${BLUE}[INFO]${NC} $*"; }
ok()   { echo -e "${GREEN}[OK]${NC} $*"; }
warn() { echo -e "${YELLOW}[WARN]${NC} $*"; }
err()  { echo -e "${RED}[ERROR]${NC} $*"; }

# -------------------------------------------------
# 1. Check prerequisites
# -------------------------------------------------
check_prereqs() {
    info "Checking prerequisites..."

    # Docker
    if ! command -v docker &> /dev/null; then
        err "Docker is not installed. Please install Docker first:"
        err "  https://docs.docker.com/get-docker/"
        exit 1
    fi
    ok "Docker CLI found"

    # Docker daemon running?
    if ! docker info &> /dev/null; then
        err "Docker daemon is not running. Please start Docker."
        exit 1
    fi
    ok "Docker daemon is running"

    # Docker Compose (plugin or standalone)
    if docker compose version &> /dev/null || command -v docker-compose &> /dev/null; then
        ok "Docker Compose found"
    else
        err "Docker Compose is not installed. Please install it:"
        err "  https://docs.docker.com/compose/install/"
        exit 1
    fi

    # Node 20+ (host-level check, mainly useful for local tooling)
    if command -v node &> /dev/null; then
        NODE_VERSION=$(node -v | sed 's/v//')
        NODE_MAJOR=$(echo "$NODE_VERSION" | cut -d. -f1)
        if [[ "$NODE_MAJOR" -ge 20 ]]; then
            ok "Node.js v${NODE_VERSION} found"
        else
            warn "Node.js v${NODE_VERSION} found (v20+ recommended). Skipping since app runs inside Docker."
        fi
    else
        warn "Node.js not found on host. Not required because app runs inside Docker, but local tooling may need it."
    fi
}

# -------------------------------------------------
# 2. Clone / Init check
# -------------------------------------------------
check_project_structure() {
    info "Checking project structure..."

    if [[ ! -d "${PROJECT_DIR}/frontend" ]]; then
        warn "Missing frontend/ directory."
        mkdir -p "${PROJECT_DIR}/frontend"
    fi

    if [[ ! -d "${PROJECT_DIR}/backend" ]]; then
        warn "Missing backend/ directory."
        mkdir -p "${PROJECT_DIR}/backend"
    fi

    if [[ ! -f "${PROJECT_DIR}/frontend/package.json" ]]; then
        warn "No package.json in frontend/. Make sure to create your Next.js app here."
        warn "  Example: npx create-next-app@14 frontend"
    fi

    if [[ ! -f "${PROJECT_DIR}/backend/package.json" ]]; then
        warn "No package.json in backend/. Make sure to create your Strapi app here."
        warn "  Example: npx create-strapi-app@latest backend --quickstart"
    fi
}

# -------------------------------------------------
# 3. Create .env.example if missing
# -------------------------------------------------
create_env_example() {
    local envfile="${PROJECT_DIR}/.env.example"
    if [[ -f "$envfile" ]]; then
        ok ".env.example already exists"
        return 0
    fi

    info "Creating .env.example..."
    cat > "$envfile" << 'EOF'
# =============================================
# Taka Inside - Local Development Environment
# =============================================

# -------------------------------------------------
# PostgreSQL Database Configuration
# -------------------------------------------------
DATABASE_NAME=taka_db
DATABASE_USERNAME=taka_user
DATABASE_PASSWORD=change_me_secure_password

# -------------------------------------------------
# Strapi Backend Secrets (Generate before first run)
# -------------------------------------------------
# You can generate these with: openssl rand -base64 16
APP_KEYS=key1,key2,key3,key4
API_TOKEN_SALT=your_api_token_salt_here
ADMIN_JWT_SECRET=your_admin_jwt_secret_here
TRANSFER_TOKEN_SALT=your_transfer_token_salt_here
JWT_SECRET=your_jwt_secret_here

# -------------------------------------------------
# pgAdmin Configuration (Optional)
# -------------------------------------------------
PGADMIN_EMAIL=admin@taka.local
PGADMIN_PASSWORD=admin

# -------------------------------------------------
# Frontend / API URLs
# -------------------------------------------------
NEXT_PUBLIC_STRAPI_API_URL=http://localhost:1337
STRAPI_API_URL=http://backend:1337
EOF
    ok ".env.example created at ${envfile}"
}

# -------------------------------------------------
# 4. Create .env if missing (from .env.example)
# -------------------------------------------------
create_env() {
    local envfile="${PROJECT_DIR}/.env"
    if [[ -f "$envfile" ]]; then
        ok ".env already exists"
        return 0
    fi

    if [[ ! -f "${PROJECT_DIR}/.env.example" ]]; then
        err ".env.example is missing, cannot create .env"
        exit 1
    fi

    info "Creating .env from .env.example..."
    cp "${PROJECT_DIR}/.env.example" "$envfile"
    ok ".env created at ${envfile}"
    warn "IMPORTANT: Review and update secrets in ${envfile} before running in production."
}

# -------------------------------------------------
# 5. Launch docker-compose
# -------------------------------------------------
launch_stack() {
    info "Launching Docker Compose stack..."
    cd "$PROJECT_DIR"

    # Detect compose command
    if docker compose version &> /dev/null; then
        COMPOSE_CMD="docker compose"
    else
        COMPOSE_CMD="docker-compose"
    fi

    $COMPOSE_CMD up -d --build

    ok "Stack launched successfully!"
}

# -------------------------------------------------
# 6. Display URLs
# -------------------------------------------------
print_urls() {
    echo ""
    echo -e "${GREEN}============================================${NC}"
    echo -e "${GREEN}  Taka Inside - Development URLs${NC}"
    echo -e "${GREEN}============================================${NC}"
    echo ""
    echo -e "  ${BLUE}Next.js Frontend:${NC}  http://localhost:3000"
    echo -e "  ${BLUE}Strapi Backend:${NC}    http://localhost:1337"
    echo -e "  ${BLUE}PostgreSQL:${NC}       localhost:5432"
    echo -e "  ${BLUE}pgAdmin:${NC}          http://localhost:5050"
    echo ""
    echo -e "  ${YELLOW}pgAdmin login:${NC}"
    echo -e "    Email:    ${PGADMIN_EMAIL:-admin@taka.local}"
    echo -e "    Password: ${PGADMIN_PASSWORD:-admin}"
    echo ""
    echo -e "  ${YELLOW}Database credentials:${NC}"
    echo -e "    DB:       ${DATABASE_NAME:-taka_db}"
    echo -e "    User:     ${DATABASE_USERNAME:-taka_user}"
    echo -e "    Password: ${DATABASE_PASSWORD:-taka_password}"
    echo ""
    echo -e "${GREEN}============================================${NC}"
}

# -------------------------------------------------
# Main
# -------------------------------------------------
main() {
    echo -e "${GREEN}Taka Inside - Development Setup${NC}"
    echo ""

    check_prereqs
    check_project_structure
    create_env_example
    create_env
    launch_stack
    print_urls

    info "To view logs: docker compose logs -f"
    info "To stop:    docker compose down"
}

main "$@"
