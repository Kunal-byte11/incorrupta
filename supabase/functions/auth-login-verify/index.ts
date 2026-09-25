import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { verifyAuthenticationResponse } from 'npm:@simplewebauthn/server@^10.0.0';
import { corsHeaders } from '../_shared/cors.ts';

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { sevarth_id, response, expectedChallenge, authenticator } = await req.json();

    if (!sevarth_id || !response || !expectedChallenge || !authenticator) {
      return new Response(
        JSON.stringify({ error: 'Missing required authentication verification parameters' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const origin = req.headers.get('origin') || 'http://localhost:5173';
    const url = new URL(origin);
    const rpID = url.hostname;

    // Convert stored public key to Uint8Array if passed as array or base64
    let credentialPublicKey = authenticator.credentialPublicKey;
    if (Array.isArray(credentialPublicKey)) {
      credentialPublicKey = new Uint8Array(credentialPublicKey);
    } else if (typeof credentialPublicKey === 'string') {
      const binaryString = atob(credentialPublicKey);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      credentialPublicKey = bytes;
    }

    const verification = await verifyAuthenticationResponse({
      response,
      expectedChallenge,
      expectedOrigin: origin,
      expectedRPID: rpID,
      authenticator: {
        credentialPublicKey,
        credentialID: authenticator.credentialID,
        counter: authenticator.counter || 0,
      },
      requireUserVerification: true,
    });

    if (verification.verified && verification.authenticationInfo) {
      return new Response(
        JSON.stringify({
          verified: true,
          newCounter: verification.authenticationInfo.newCounter,
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ verified: false, error: 'Authentication assertion failed verification' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
