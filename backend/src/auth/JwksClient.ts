import Axios from 'axios';

// based of this example: https://gist.github.com/westmark/faee223e05bcbab433bfd4ed8e36fb5f

function certToPEM(cert: string) : string {
    let pem = cert.match( /.{1,64}/g ).join( '\n' );
    pem = `-----BEGIN CERTIFICATE-----\n${ cert }\n-----END CERTIFICATE-----\n`;
    return pem;
}
  
function getJWKs(jwkUri: string): Promise<any> {
    return Axios({
        method: 'get',
        url: jwkUri,
        responseType: 'json'
    })
    .then((response) => response.data.keys)
    .catch((error) => {
        throw new Error(error);
    });
}

function getJWKSSigningKeys(jwks: any): any {
    return jwks
      .filter((key) =>
          key.use === 'sig' && // JWK property `use` determines the JWK is for signing
          key.kty === 'RSA' && // We are only supporting RSA (RS256)
          key.kid && // The `kid` must be present to be useful for later
          ((key.x5c && key.x5c.length) || (key.n && key.e)) // Has useful public keys
      )
      .map((key) => ({ kid: key.kid, nbf: key.nbf, publicKey: certToPEM(key.x5c[0])}));
  }

  export async function getJWKSSigningKey(kid: any, jwkUri: string): Promise<any> {
    const jwks = await getJWKs(jwkUri);
    const signingKeys = getJWKSSigningKeys(jwks);
    return signingKeys.find( ( key ) => key.kid === kid );
  }
  