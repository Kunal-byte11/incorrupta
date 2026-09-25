import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { verifyRegistrationResponse } from 'npm:@simplewebauthn/server@^10.0.0';
import { corsHeaders } from '../_shared/cors.ts';

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { sevarth_id, response, expectedChallenge } = await req.json();

    if (!sevarth_id || !response || !expectedChallenge) {
      return new Response(
        JSON.stringify({ error: 'Missing sevarth_id, response payload, or expectedChallenge' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const origin = req.headers.get('origin') || 'http://localhost:5173';
    const url = new URL(origin);
    const rpID = url.hostname;

    const verification = await verifyRegistrationResponse({
      response,
      expectedChallenge,
      expectedOrigin: origin,
      expectedRPID: rpID,
      requireUserVerification: true,
    });

    if (verification.verified && verification.registrationInfo) {
      const { credential } = verification.registrationInfo;
      return new Response(
        JSON.stringify({
          verified: true,
          credentialId: credential.id,
          publicKey: credential.publicKey,
          counter: credential.counter,
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ verified: false, error: 'Registration verification failed' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
