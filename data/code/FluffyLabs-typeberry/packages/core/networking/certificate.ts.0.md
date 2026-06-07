---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/networking/certificate.ts#L1-L115
title: packages/core/networking/certificate.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-02T00:04:19+02:00'
last_modified: '2026-06-02T00:04:19+02:00'
chunk_index: 0
chunk_total: 3
content_sha: 12b30faf523f7c15b97ae94fef943f81e1d5cb1cc64ce1a63eb8459843884284
language: typescript
---
`packages/core/networking/certificate.ts` (lines 1–115)

```typescript
import crypto, { type JsonWebKey } from "node:crypto";
import type { CryptoKey } from "@peculiar/webcrypto";
import * as peculiarWebcrypto from "@peculiar/webcrypto";
import * as x509 from "@peculiar/x509";
import { Bytes, BytesBlob } from "@typeberry/bytes";
import { ED25519_KEY_BYTES, type Ed25519Key, type ed25519 } from "@typeberry/crypto";
import { Logger } from "@typeberry/logger";
import { asOpaqueType, Result } from "@typeberry/utils";
import { base32 } from "./base32.js";
import type { PeerId } from "./peers.js";

const logger = Logger.new(import.meta.filename, "net");

// TODO [ToDr] Might not be relevant any more and we can use built-in webcrypto.
// overwrite crypto provider to use the @peculiar version
// (ed25519 issues in the node one, see:
// https://github.com/MatrixAI/js-quic/blob/staging/tests/utils.ts#L16C9-L16C64
// )
const webcrypto = new peculiarWebcrypto.Crypto();
x509.cryptoProvider.set(webcrypto);

const CURVE_NAME = "Ed25519";
const KEY_TYPE = "OKP"; // Offline Key Pair

export enum VerifyCertError {
  NoCertificate = 0,
  NotEd25519 = 1,
  PublicKeyTypeMismatch = 2,
  AltNameMismatch = 3,
  IncorrectSignature = 4,
}

export type PeerInfo = {
  id: PeerId;
  key: Ed25519Key;
};

export async function verifyCertificate(certs: Uint8Array[]): Promise<Result<PeerInfo, VerifyCertError>> {
  logger.log`Incoming peer. Verifying certificate`;
  // Must present exactly one cert
  if (certs.length !== 1) {
    logger.log`Rejecting peer: expected exactly one certificate, got: ${certs.length}`;
    return Result.error(
      VerifyCertError.NoCertificate,
      () => `Certificate validation failed: expected exactly one certificate, got ${certs.length}`,
    );
  }

  // Parse with Node's X509Certificate (accepts PEM or DER)
  const xc = new crypto.X509Certificate(certs[0]);

  // Must be Ed25519 key
  if (xc.publicKey.asymmetricKeyType !== CURVE_NAME.toLowerCase()) {
    logger.log`Rejecting peer using non-ed25519 certificate: ${xc.publicKey.asymmetricKeyType}`;
    return Result.error(
      VerifyCertError.NotEd25519,
      () => `Certificate validation failed: expected Ed25519 key, got ${xc.publicKey.asymmetricKeyType}`,
    );
  }

  // Extract raw public key via JWK export
  const jwk = xc.publicKey.export({ format: "jwk" });
  if (jwk.kty !== KEY_TYPE || jwk.crv !== CURVE_NAME) {
    logger.log`Public key type mismatch: ${jwk.kty}, ${jwk.crv}`;
    return Result.error(
      VerifyCertError.PublicKeyTypeMismatch,
      () => `Certificate validation failed: public key type mismatch (kty: ${jwk.kty}, crv: ${jwk.crv})`,
    );
  }

  // SAN must be exactly 'e'+base32(rawPub)
  const expectedSan = altNameJwk(jwk);
  const sanField = xc.subjectAltName ?? "";
  const m = sanField.match(/DNS:([^,]+)/);
  if (m === null || m[1] !== expectedSan) {
    logger.log`AltName mismatch. Expected: '${expectedSan}', got: '${m?.[1]}'`;
    return Result.error(
      VerifyCertError.AltNameMismatch,
      () => `Certificate validation failed: altName mismatch (expected: ${expectedSan}, got: ${m?.[1] ?? "none"})`,
    );
  }

  const key = Buffer.from(jwk.x ?? "", "base64url");

  if (!xc.verify(xc.publicKey)) {
    logger.log`Certificate validation failed: incorrect signature`;
    return Result.error(VerifyCertError.IncorrectSignature, () => "Certificate validation failed: incorrect signature");
  }

  const publicKey = Bytes.fromBlob(new Uint8Array(key), ED25519_KEY_BYTES);
  return Result.ok({
    id: asOpaqueType(expectedSan),
    key: publicKey.asOpaque(),
  });
}

export async function generateKeyPairEd25519(): Promise<{
  publicKey: JsonWebKey;
  privateKey: JsonWebKey;
}> {
  const keyPair = await webcrypto.subtle.generateKey(
    {
      name: "EdDSA",
      namedCurve: "Ed25519",
    },
    true,
    ["sign", "verify"],
  );

  return {
    publicKey: await webcrypto.subtle.exportKey("jwk", keyPair.publicKey),
    privateKey: await webcrypto.subtle.exportKey("jwk", keyPair.privateKey),
  };
}

```
