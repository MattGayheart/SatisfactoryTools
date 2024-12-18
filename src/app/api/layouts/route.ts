import { NextResponse } from "next/server";

let layouts = { nodes: [], edges: [] };

export async function GET() {
  return NextResponse.json(layouts);
}

export async function POST(request: Request) {
  const body = await request.json();
  layouts = body;
  return NextResponse.json({ message: "Layout saved successfully" });
}
