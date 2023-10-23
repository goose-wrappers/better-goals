import {createVerify} from "crypto";
import {UrlFetchPromise} from "./url-fetch-promise";

interface JwtHeader {
	kid: string;
	alg: string;
}

export class JwtVerify {

	private getTokenSegments(token: string): Array<string> {
		const segments = token.split(".");
		if (segments.length !== 3) {
			throw new Error("JWT must have 3 segments");
		}

		return segments;
	}

	private getJwtHeader(token: string): JwtHeader {
		const segments = this.getTokenSegments(token);
		return JSON.parse(atob(segments[0]));
	}

	private getAlgorithm(token: string): string {
		const header = this.getJwtHeader(token);
		return header.alg;
	}

	private getKeyId(token: string): string {
		const header = this.getJwtHeader(token);
		return header.kid;
	}

	private decodeAsymmetric(token: string, publicKey: string, alg: string): any {
		if (alg != "RS256") {
			throw new Error("Only RS256 is supported");
		}

		const [headerSeg, payloadSeg, signatureSeg] = this.getTokenSegments(token);
		const input = [headerSeg, payloadSeg].join(".");
		const verified = createVerify("RSA-SHA256").update(input).verify(publicKey, signatureSeg, "base64");
		if (!verified) {
			throw new Error("Could not verify RS256 signature");
		}

		return JSON.parse(atob(payloadSeg));
	}

	public async assertValidJwtToken(token: string) {
		const alg = this.getAlgorithm(token);
		const kid = this.getKeyId(token);

		const url = `https://connect-install-keys.atlassian.com/${kid}`;
		const publicKey = await UrlFetchPromise.get(url, {});

		// this throws an exception if RS256 signature is invalid
		this.decodeAsymmetric(token, publicKey, alg);
	}

	public async assertValidAuthorizationHeader(authorization: string) {
		if (!authorization.startsWith("JWT ")) {
			throw new Error(`Authorization header does not start with JWT: ${authorization}`);
		}

		const token = authorization.substring("JWT ".length);
		return this.assertValidJwtToken(token);
	}
}
