---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/networking/peer-verification.ts#L1-L41
title: packages/core/networking/peer-verification.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-07-03T23:06:13+02:00'
last_modified: '2026-07-03T23:06:13+02:00'
chunk_index: 0
chunk_total: 1
content_sha: 39f03243d75297af632b533bdd751de4ea46dec811c221496e38bd60b691ba99
language: typescript
---
`packages/core/networking/peer-verification.ts` (lines 1–41)

```typescript
import { native } from "@matrixai/quic";
import { type PeerInfo, VerifyCertError, verifyCertificate } from "./certificate.js";

export function peerVerification() {
  const peer: {
    info: PeerInfo | null;
    /** Takes all certicates the peer presented and all local certifcates from Certificate Authorities (unused) */
    verifyCallback: (certs: Uint8Array[], cas: Uint8Array[]) => Promise<ReturnType<typeof asCryptoError> | undefined>;
  } = {
    info: null,
    verifyCallback: async (certs: Uint8Array[], _cas: Uint8Array[]) => {
      const verification = await verifyCertificate(certs);
      if (verification.isError) {
        return asCryptoError(verification.error);
      }
      peer.info = verification.ok;
      return undefined;
    },
  };
  return peer;
}

function asCryptoError(error: VerifyCertError | undefined) {
  if (error === undefined) {
    return error;
  }
  switch (error) {
    case VerifyCertError.AltNameMismatch:
      return native.CryptoError.IllegalParameter;
    case VerifyCertError.NotEd25519:
      return native.CryptoError.InsufficientSecurity;
    case VerifyCertError.PublicKeyTypeMismatch:
      return native.CryptoError.BadCertificate;
    case VerifyCertError.NoCertificate:
      return native.CryptoError.CertificateRequired;
    case VerifyCertError.IncorrectSignature:
      return native.CryptoError.BadCertificate;
    default:
      throw new Error(`Unexpected VerifyCertError: ${error}`);
  }
}
```
