import * as jwt from "atlassian-jwt";
import {UrlFetchPromise} from "./url-fetch-promise";

export = class JwtVerify {
	public async assertValidJwtToken(token: string) {
		const alg = jwt.getAlgorithm(token);
		const kid = jwt.getKeyId(token);

		const url = `https://connect-install-keys.atlassian.com/${kid}`;
		const publicKey = await UrlFetchPromise.get(url, {});

		// this throws an exception if RS256 signature is invalid
		jwt.decodeAsymmetric(token, publicKey, alg);
	}

	public async assertValidAuthorizationHeader(authorization: string) {
		if (!authorization.startsWith("JWT ")) {
			throw new Error(`Authorization header does not start with JWT: ${authorization}`);
		}

		const token = authorization.substring("JWT ".length);
		return this.assertValidJwtToken(token);
	}

	public async isJwtAuthenticated(event: any): Promise<boolean> {
		try {
			const authorization = event.headers["authorization"] || "";

			const verifier = new JwtVerify();
			await verifier.assertValidAuthorizationHeader(authorization);
			return true;
		} catch (e) {
			return false;
		}
	}
}
