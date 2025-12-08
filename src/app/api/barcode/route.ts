// app/api/barcode/route.ts
import { NextRequest, NextResponse } from "next/server";
import QRCode from "qrcode";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const text = searchParams.get("text");

  if (!text) {
    return NextResponse.json({ error: "Texto é obrigatório" }, { status: 400 });
  }

  try {
    // Gera o QR Code como buffer PNG
    const pngBuffer = await QRCode.toBuffer(text, {
      type: "png",
      width: 500, // largura em pixels, ajuste se quiser maior/menor
      margin: 2,  // margem em blocos
    });

    const pngArray = new Uint8Array(pngBuffer);

    return new NextResponse(pngArray, {
      status: 200,
      headers: { "Content-Type": "image/png" },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
