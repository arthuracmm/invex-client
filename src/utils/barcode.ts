import type { NextApiRequest, NextApiResponse } from 'next';
import bwipjs from 'bwip-js';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { text } = req.query;

  if (!text || typeof text !== 'string') {
    return res.status(400).send('Texto é obrigatório');
  }

  try {
    const png = await bwipjs.toBuffer({
      bcid:        'code128',
      text:        text,
      scale:       3,
      height:      10,
      includetext: true,
      textxalign:  'center',
    });

    res.setHeader('Content-Type', 'image/png');
    res.send(png);
  } catch (err: any) {
    res.status(500).send('Erro ao gerar o código de barras: ' + err.message);
  }
}
