// DB diagnostic endpoint - check if tables exist
import { NextResponse } from 'next/server';
import { db } from '@/db';
import { sql } from 'drizzle-orm';

export async function GET() {
    try {
        // Check which tables exist
        const result = await db.execute(sql`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public'
            ORDER BY table_name
        `);

        const tables = result.map((r: any) => r.table_name);

        const requiredTables = ['users', 'accounts', 'sessions', 'verification_tokens', 'trees', 'tree_members', 'persons', 'relationships'];
        const missing = requiredTables.filter(t => !tables.includes(t));

        return NextResponse.json({
            status: missing.length === 0 ? 'ok' : 'missing_tables',
            existingTables: tables,
            missingTables: missing,
            dbConnected: true,
        });
    } catch (error: any) {
        return NextResponse.json({
            status: 'error',
            dbConnected: false,
            error: error.message,
        }, { status: 500 });
    }
}
