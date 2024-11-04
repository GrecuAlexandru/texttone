import { NextResponse } from 'next/server'
import NaturalLanguageUnderstandingV1 from 'ibm-watson/natural-language-understanding/v1'
import { IamAuthenticator } from 'ibm-watson/auth'

const naturalLanguageUnderstanding = new NaturalLanguageUnderstandingV1({
    version: '2022-04-07',
    authenticator: new IamAuthenticator({
        apikey: process.env.IBM_API_KEY,
    }),
    serviceUrl: process.env.IBM_SERVICE_URL,
})

export async function POST(req) {
    const { text } = await req.json()

    const analyzeParams = {
        'text': text,
        'features': {
            'entities': {
                'emotion': true,
                'sentiment': true,
                'limit': 2,
            },
            'keywords': {
                'emotion': true,
                'sentiment': true,
                'limit': 2,
            },
        },
    }

    try {
        const analysisResults = await naturalLanguageUnderstanding.analyze(analyzeParams)
        console.log('Analysis results:', analysisResults.result)
        return NextResponse.json(analysisResults.result)
    } catch (err) {
        console.error('Error:', err)
        return NextResponse.json({ error: 'An error occurred while analyzing the text.' }, { status: 500 })
    }
}