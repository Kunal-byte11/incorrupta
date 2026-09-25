import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { generateRegistrationOptions } from 'npm:@simplewebauthn/server@^10.0.0';
import { corsHeaders } from '../_shared/cors.ts';

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { sevarth_id, full_name } = await req.json();

    if (!sevarth_id || typeof sevarth_id !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Valid Maharashtra Police Sevarth ID is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const rpName = 'Mumbai Police INCORRUPTA';
    const origin = req.headers.get('origin') || 'http://localhost:5173';
    const url = new URL(origin);
    const rpID = url.hostname;

    const encoder = new TextEncoder();
    const userID = encoder.encode(sevarth_id);

    const options = await generateRegistrationOptions({
      rpName,
      rpID,
      userID,
      userName: sevarth_id,
      userDisplayName: `${full_name || sevarth_id} (${sevarth_id})`,
      attestationType: 'none',
      authenticatorSelection: {
        userVerification: 'required',
        residentKey: 'preferred',
      },
    });

    return new Response(JSON.stringify(options), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
