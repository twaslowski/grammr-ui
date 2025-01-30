import { NextApiRequest } from 'next';
import { NextResponse } from 'next/server';

export async function POST(req: NextApiRequest) {
  try {
    const { text } = req.body;

    const response = {
      sourcePhrase: text,
      semanticTranslation: {
        sourcePhrase: 'wie geht es dir?',
        translatedPhrase: 'Как дела?',
      },
      analyzedTokens: [
        {
          text: 'Как',
          translation: {
            source: 'как',
            translation: 'wie',
          },
          morphology: {
            text: 'Как',
            lemma: 'как',
            features: [],
            pos: 'SCONJ',
          },
        },
        {
          text: 'дела',
          translation: {
            source: 'дела',
            translation: "Wie geht's?",
          },
          morphology: {
            text: 'дела',
            lemma: 'дело',
            features: [
              {
                type: 'ANIMACY',
                value: 'INAN',
                enumValue: 'INAN',
              },
              {
                type: 'CASE',
                value: 'NOM',
                enumValue: 'NOM',
              },
              {
                type: 'GENDER',
                value: 'NEUT',
                enumValue: 'NEUT',
              },
              {
                type: 'NUMBER',
                value: 'PLUR',
                enumValue: 'PLUR',
              },
            ],
            pos: 'NOUN',
          },
        },
      ],
    };

    return NextResponse.json(response, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    return NextResponse.json({
      message: 'Internal server error',
      status: 400,
    });
  }
}
