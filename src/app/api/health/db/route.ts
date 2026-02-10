// DB diagnostic endpoint - check connection and tables
import { NextResponse } from 'next/server';

export async function GET() {
    const dbUrl = process.env.DATABASE_URL;

    // Check if DATABASE_URL is set (mask credentials)
    if (!dbUrl) {
        return NextResponse.json({
            status: 'error',
            dbConnected: false,
            error: 'DATABASE_URL environment variable is not set',
        }, { status: 500 });
    }

    // Mask the URL for security (show host/port/dbname only)
    let maskedUrl = 'not parseable';
    try {
        const url = new URL(dbUrl);
        maskedUrl = `${url.protocol}//*****@${url.host}${url.pathname}`;
    } catch {
        maskedUrl = dbUrl.replace(/\/\/[^@]+@/, '//*****@');
    }

    try {
        // Use a fresh postgres connection with short timeout
        const postgres = (await import('postgres')).default;
        const sql = postgres(dbUrl, {
            max: 1,
            connect_timeout: 5,
            idle_timeout: 5,
        });

        // Test basic connectivity
        const result = await sql`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public'
            ORDER BY table_name
        `;

        const tables = result.map((r: { table_name: string }) => r.table_name);
        const requiredTables = ['users', 'accounts', 'sessions', 'verification_tokens', 'trees', 'tree_members', 'persons', 'relationships'];
        const missing = requiredTables.filter(t => !tables.includes(t));

        await sql.end();

        return NextResponse.json({
            status: missing.length === 0 ? 'ok' : 'missing_tables',
            dbConnected: true,
            maskedUrl,
            existingTables: tables,
            missingTables: missing,
        });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : String(error);
        return NextResponse.json({
            status: 'connection_failed',
            dbConnected: false,
            maskedUrl,
            error: message,
        }, { status: 500 });
    }
}
