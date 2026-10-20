const OPENAI_API_URL = 'https://api.openai.com/v1';

export const OPENAI_TEXT_MODEL = process.env.OPENAI_TEXT_MODEL || 'gpt-4o';
export const OPENAI_IMAGE_MODEL = process.env.OPENAI_IMAGE_MODEL || 'gpt-image-1-mini';

const getApiKey = () => {
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
        throw new Error('OPENAI_API_KEY não está configurada.');
    }

    return apiKey;
};

const requestOpenAI = async (path, body) => {
    const response = await fetch(`${OPENAI_API_URL}${path}`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${getApiKey()}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
        const error = new Error(data?.error?.message || 'A OpenAI não conseguiu processar a solicitação.');
        error.status = response.status;
        error.code = data?.error?.code;
        throw error;
    }

    return data;
};

export const generateStructuredResponse = async ({ name, schema, instructions, input }) => {
    const response = await requestOpenAI('/responses', {
        model: OPENAI_TEXT_MODEL,
        instructions,
        input: JSON.stringify(input),
        text: {
            format: {
                type: 'json_schema',
                name,
                strict: true,
                schema,
            },
        },
    });

    const outputText = response.output
        ?.flatMap((item) => item.content || [])
        .find((item) => item.type === 'output_text')?.text;

    if (!outputText) {
        const refusal = response.output
            ?.flatMap((item) => item.content || [])
            .find((item) => item.type === 'refusal')?.refusal;
        throw new Error(refusal || 'A OpenAI retornou uma resposta vazia.');
    }

    return JSON.parse(outputText);
};

export const generateImage = async (prompt) => {
    const response = await requestOpenAI('/images/generations', {
        model: OPENAI_IMAGE_MODEL,
        prompt,
        size: '1536x1024',
        quality: 'low',
        output_format: 'webp',
    });
    const image = response.data?.[0]?.b64_json;

    if (!image) {
        throw new Error('A OpenAI não retornou a imagem do curso.');
    }

    return `data:image/webp;base64,${image}`;
};

export const openAIErrorResponse = (error) => {
    console.error('OpenAI request failed', {
        message: error?.message,
        code: error?.code,
        status: error?.status,
    });

    const status = error?.status >= 400 && error?.status < 500 ? error.status : 500;
    return Response.json({ error: error?.message || 'Erro ao gerar o curso.' }, { status });
};
