---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/networking/certificate.ts#L107-L209
title: packages/core/networking/certificate.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-15T16:53:45Z'
last_modified: '2026-06-15T16:53:45Z'
chunk_index: 1
chunk_total: 3
content_sha: 21400889ce641b14c51ac751b4bcd01ddd3a9c657a2a6bf1290cb46a23f957c6
language: typescript
---
`packages/core/networking/certificate.ts` (lines 107–209)

```typescript
    ["sign", "verify"],
  );

  return {
    publicKey: await webcrypto.subtle.exportKey("jwk", keyPair.publicKey),
    privateKey: await webcrypto.subtle.exportKey("jwk", keyPair.privateKey),
  };
}

export async function privateKeyToPEM(keypair: JsonWebKeyPair) {
  const key = await importEd25519Key(keypair.privateKey, KeyType.Private);
  // Export as PKCS8
  const exported = await webcrypto.subtle.exportKey("pkcs8", key);
  // Base64-encode and wrap as PEM
  const b64 = Buffer.from(exported).toString("base64");
  const lines = b64.match(/.{1,64}/g) ?? [];
  return ["-----BEGIN PRIVATE KEY-----", ...lines, "-----END PRIVATE KEY-----", ""].join("\n");
}

/** Adapted from https://github.com/MatrixAI/js-quic/blob/staging/tests/utils.ts#L388 */
export async function generateCertificate({
  certId,
  subjectKeyPair,
  issuerKeyPair,
  subjectAttrsExtra = [],
  issuerAttrsExtra = [],
  now = new Date(),
}: {
  certId: BytesBlob;
  subjectKeyPair: JsonWebKeyPair;
  issuerKeyPair: JsonWebKeyPair;
  subjectAttrsExtra?: Array<{ [key: string]: string[] }>;
  issuerAttrsExtra?: Array<{ [key: string]: string[] }>;
  now?: Date;
}): Promise<x509.X509Certificate> {
  const subjectPublicCryptoKey = await importEd25519Key(subjectKeyPair.publicKey, KeyType.Public);
  const subjectPrivateCryptoKey = await importEd25519Key(subjectKeyPair.privateKey, KeyType.Private);
  const issuerPrivateCryptoKey = await importEd25519Key(issuerKeyPair.privateKey, KeyType.Private);
  const issuerPublicCryptoKey = await importEd25519Key(issuerKeyPair.publicKey, KeyType.Public);

  // X509 `UTCTime` format only has resolution of seconds
  // this truncates to second resolution
  const notBeforeDate = new Date(now.getTime() - (now.getTime() % 1000));
  const durationSeconds = 2;
  const notAfterDate = new Date(now.getTime() - (now.getTime() % 1000) + durationSeconds * 1000);

  const subjectNodeId = await webcrypto.subtle.digest(
    "SHA-256",
    await webcrypto.subtle.exportKey("spki", subjectPublicCryptoKey),
  );
  const issuerNodeId = await webcrypto.subtle.digest(
    "SHA-256",
    await webcrypto.subtle.exportKey("spki", issuerPublicCryptoKey),
  );
  const serialNumber = certId.toString().substring(2);
  const subjectNodeIdEncoded = Buffer.from(subjectNodeId).toString("hex");
  const issuerNodeIdEncoded = Buffer.from(issuerNodeId).toString("hex");
  // The entire subject attributes and issuer attributes
  // is constructed via `x509.Name` class
  // By default this supports on a limited set of names:
  // CN, L, ST, O, OU, C, DC, E, G, I, SN, T
  // If custom names are desired, this needs to change to constructing
  // `new x509.Name('FOO=BAR', { FOO: '1.2.3.4' })` manually
  // And each custom attribute requires a registered OID
  // Because the OID is what is encoded into ASN.1
  const subjectAttrs = [
    {
      CN: [subjectNodeIdEncoded],
    },
    // Filter out conflicting CN attributes
    ...subjectAttrsExtra.filter((attr) => !("CN" in attr)),
  ];
  const issuerAttrs = [
    {
      CN: [issuerNodeIdEncoded],
    },
    // Filter out conflicting CN attributes
    ...issuerAttrsExtra.filter((attr) => !("CN" in attr)),
  ];
  const certConfig = {
    serialNumber,
    notBefore: notBeforeDate,
    notAfter: notAfterDate,
    subject: subjectAttrs,
    issuer: issuerAttrs,
    signingAlgorithm: issuerPrivateCryptoKey.algorithm,
    publicKey: subjectPublicCryptoKey,
    signingKey: subjectPrivateCryptoKey,
    extensions: [
      new x509.BasicConstraintsExtension(true),
      new x509.KeyUsagesExtension(
        x509.KeyUsageFlags.keyCertSign |
          x509.KeyUsageFlags.cRLSign |
          x509.KeyUsageFlags.digitalSignature |
          x509.KeyUsageFlags.nonRepudiation |
          x509.KeyUsageFlags.keyAgreement |
          x509.KeyUsageFlags.keyEncipherment |
          x509.KeyUsageFlags.dataEncipherment,
      ),
      new x509.ExtendedKeyUsageExtension([]),
      new x509.SubjectAlternativeNameExtension([
        {
          type: "dns",
```
