import { NextResponse } from "next/server";
import postgres from "postgres";

// Initialize the client using environment variables
const sql = postgres(process.env.DATABASE_URL!, {
  // Optional: Max connections to prevent pool exhaustion in serverless
  max: 10,
  idle_timeout: 20,
  connect_timeout: 5,
});

export async function GET() {
  try {
    // Execute a trivial query using tagged template literal
    await sql`SELECT 1`;

    return NextResponse.json({
      status: "ok",
      database: "connected",
    });
  } catch (error) {
    console.error("Database health check failed:", error);

    return NextResponse.json(
      {
        status: "error",
        database: "disconnected",
      },
      { status: 503 },
    );
  }
}
