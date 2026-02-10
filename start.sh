#!/bin/sh
# ═══════════════════════════════════════════════════════════════════════════════
# WIJA - Docker Startup Script
# Applies database schema then starts the Next.js server
# ═══════════════════════════════════════════════════════════════════════════════

set -e

echo "🔄 Applying database schema..."

# Try drizzle-kit push (globally installed)
if command -v drizzle-kit > /dev/null 2>&1; then
    drizzle-kit push --force 2>&1 || {
        echo "⚠️  drizzle-kit push failed, trying npx..."
        npx drizzle-kit push --force 2>&1 || {
            echo "⚠️  Schema push failed, but continuing startup..."
        }
    }
else
    echo "⚠️  drizzle-kit not found in PATH, trying npx..."
    npx drizzle-kit push --force 2>&1 || {
        echo "⚠️  Schema push failed, but continuing startup..."
    }
fi

echo "✅ Database schema step complete"

echo "🚀 Starting WIJA..."
exec node server.js
