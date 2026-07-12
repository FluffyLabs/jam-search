---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/networking/certificate.ts#L203-L281
title: packages/core/networking/certificate.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-07-11T19:25:25+02:00'
last_modified: '2026-07-11T19:25:25+02:00'
chunk_index: 2
chunk_total: 3
content_sha: fbff8a0c9b7c600d77564f94bc501efaf2e614ae43ddd0bc4333a75a05d3de93
language: typescript
---
`packages/core/networking/certificate.ts` (lines 203–281)

```typescript
          x509.KeyUsageFlags.keyEncipherment |
          x509.KeyUsageFlags.dataEncipherment,
      ),
      new x509.ExtendedKeyUsageExtension([]),
      new x509.SubjectAlternativeNameExtension([
        {
          type: "dns",
          value: altNameJwk(subjectKeyPair.publicKey),
        },
      ]),
      await x509.SubjectKeyIdentifierExtension.create(subjectPublicCryptoKey),
    ],
  };
  certConfig.signingKey = issuerPrivateCryptoKey;
  return await x509.X509CertificateGenerator.create(certConfig);
}

export function altNameRaw(ed25519PubKey: BytesBlob) {
  return `e${base32(ed25519PubKey.raw)}`;
}
export function altNameJwk(ed25519PubKey: JsonWebKey) {
  const rawPub = new Uint8Array(Buffer.from(ed25519PubKey.x ?? "", "base64url"));
  return altNameRaw(BytesBlob.blobFrom(rawPub));
}

enum KeyType {
  /** Used only to verify signatures. */
  Public = 0,
  /** Used only to sign. */
  Private = 1,
}

async function importEd25519Key(key: JsonWebKey, typ: KeyType): Promise<CryptoKey> {
  if (key.kty !== KEY_TYPE) {
    throw new Error(`Unsupported key type ${key.kty}`);
  }

  const algorithm = {
    name: "EdDSA",
    namedCurve: CURVE_NAME,
  };
  /** https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/importKey */
  return await webcrypto.subtle.importKey(
    "jwk",
    key,
    algorithm,
    true /* Can the key be extracted using `exportKey`? */,
    [typ === KeyType.Public ? "verify" : "sign"],
  );
}

export function certToPEM(cert: x509.X509Certificate) {
  return `${cert.toString("pem")}\n`;
}

export type JsonWebKeyPair = {
  publicKey: JsonWebKey;
  privateKey: JsonWebKey;
};

export function ed25519AsJsonWebKeyPair(keyPair: ed25519.Ed25519Pair): JsonWebKeyPair {
  const key = {
    kty: KEY_TYPE,
    crv: CURVE_NAME,
    x: Buffer.from(keyPair.pubKey.raw).toString("base64url"),
    d: Buffer.from(keyPair._privKey.raw).toString("base64url"),
  };

  return {
    publicKey: {
      ...key,
      d: undefined,
    },
    privateKey: {
      ...key,
      x: undefined,
    },
  };
}
```
