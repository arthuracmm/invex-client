// app/api/barcode/route.ts
import { NextRequest, NextResponse } from "next/server";
import bwipjs from "bwip-js";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const text = searchParams.get("text");

  if (!text) {
    return NextResponse.json({ error: "Texto é obrigatório" }, { status: 400 });
  }

  try {
    const pngBuffer = await bwipjs.toBuffer({
      bcid: "code128",
      text: text,
      scale: 3,
      height: 10,
      includetext: true,
      textxalign: "center",
    });

    // Converte o Buffer do Node para Uint8Array
    const pngArray = new Uint8Array(pngBuffer);

    return new NextResponse(pngArray, {
      status: 200,
      headers: { "Content-Type": "image/png" },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
