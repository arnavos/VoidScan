import type { QueryKey, UseMutationOptions, UseMutationResult, UseQueryOptions, UseQueryResult } from '@tanstack/react-query';
import type { AbuseIpdbResult, AsnResult, BannerInput, BannerResult, BreachResult, DnsResult, EntropyResult, FileDataInput, FileMetadataResult, GenericResult, GeoipResult, HashCompareInput, HashResult, HeadersResult, HealthStatus, MalwareHashResult, NetworkMapResult, PassphraseInput, PassphraseResult, PasswordBreachResult, PasswordEntropyResult, PasswordGenerateInput, PasswordGenerateResult, PasswordInput, PasswordStrengthResult, PhishingResult, PingResult, PortScanInput, PortScanResult, ReputationResult, ScreenshotResult, SignatureResult, SslResult, SubdomainResult, SuspiciousUrlResult, TargetInput, TechDetectResult, TracerouteResult, VirusTotalResult, WhoisResult, YaraInput, YaraResult } from './api.schemas';
import { customFetch } from '../custom-fetch';
import type { ErrorType, BodyType } from '../custom-fetch';
type AwaitedInput<T> = PromiseLike<T> | T;
type Awaited<O> = O extends AwaitedInput<infer T> ? T : never;
type SecondParameter<T extends (...args: never) => unknown> = Parameters<T>[1];
export declare const getHealthCheckUrl: () => string;
/**
 * @summary Health check
 */
export declare const healthCheck: (options?: RequestInit) => Promise<HealthStatus>;
export declare const getHealthCheckQueryKey: () => readonly ["/api/healthz"];
export declare const getHealthCheckQueryOptions: <TData = Awaited<ReturnType<typeof healthCheck>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData> & {
    queryKey: QueryKey;
};
export type HealthCheckQueryResult = NonNullable<Awaited<ReturnType<typeof healthCheck>>>;
export type HealthCheckQueryError = ErrorType<unknown>;
/**
 * @summary Health check
 */
export declare function useHealthCheck<TData = Awaited<ReturnType<typeof healthCheck>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getReconWhoisUrl: () => string;
/**
 * @summary WHOIS lookup
 */
export declare const reconWhois: (targetInput: TargetInput, options?: RequestInit) => Promise<WhoisResult>;
export declare const getReconWhoisMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof reconWhois>>, TError, {
        data: BodyType<TargetInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof reconWhois>>, TError, {
    data: BodyType<TargetInput>;
}, TContext>;
export type ReconWhoisMutationResult = NonNullable<Awaited<ReturnType<typeof reconWhois>>>;
export type ReconWhoisMutationBody = BodyType<TargetInput>;
export type ReconWhoisMutationError = ErrorType<unknown>;
/**
* @summary WHOIS lookup
*/
export declare const useReconWhois: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof reconWhois>>, TError, {
        data: BodyType<TargetInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof reconWhois>>, TError, {
    data: BodyType<TargetInput>;
}, TContext>;
export declare const getReconDnsUrl: () => string;
/**
 * @summary DNS enumeration
 */
export declare const reconDns: (targetInput: TargetInput, options?: RequestInit) => Promise<DnsResult>;
export declare const getReconDnsMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof reconDns>>, TError, {
        data: BodyType<TargetInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof reconDns>>, TError, {
    data: BodyType<TargetInput>;
}, TContext>;
export type ReconDnsMutationResult = NonNullable<Awaited<ReturnType<typeof reconDns>>>;
export type ReconDnsMutationBody = BodyType<TargetInput>;
export type ReconDnsMutationError = ErrorType<unknown>;
/**
* @summary DNS enumeration
*/
export declare const useReconDns: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof reconDns>>, TError, {
        data: BodyType<TargetInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof reconDns>>, TError, {
    data: BodyType<TargetInput>;
}, TContext>;
export declare const getReconReverseDnsUrl: () => string;
/**
 * @summary Reverse DNS lookup
 */
export declare const reconReverseDns: (targetInput: TargetInput, options?: RequestInit) => Promise<GenericResult>;
export declare const getReconReverseDnsMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof reconReverseDns>>, TError, {
        data: BodyType<TargetInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof reconReverseDns>>, TError, {
    data: BodyType<TargetInput>;
}, TContext>;
export type ReconReverseDnsMutationResult = NonNullable<Awaited<ReturnType<typeof reconReverseDns>>>;
export type ReconReverseDnsMutationBody = BodyType<TargetInput>;
export type ReconReverseDnsMutationError = ErrorType<unknown>;
/**
* @summary Reverse DNS lookup
*/
export declare const useReconReverseDns: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof reconReverseDns>>, TError, {
        data: BodyType<TargetInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof reconReverseDns>>, TError, {
    data: BodyType<TargetInput>;
}, TContext>;
export declare const getReconAsnUrl: () => string;
/**
 * @summary ASN lookup
 */
export declare const reconAsn: (targetInput: TargetInput, options?: RequestInit) => Promise<AsnResult>;
export declare const getReconAsnMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof reconAsn>>, TError, {
        data: BodyType<TargetInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof reconAsn>>, TError, {
    data: BodyType<TargetInput>;
}, TContext>;
export type ReconAsnMutationResult = NonNullable<Awaited<ReturnType<typeof reconAsn>>>;
export type ReconAsnMutationBody = BodyType<TargetInput>;
export type ReconAsnMutationError = ErrorType<unknown>;
/**
* @summary ASN lookup
*/
export declare const useReconAsn: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof reconAsn>>, TError, {
        data: BodyType<TargetInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof reconAsn>>, TError, {
    data: BodyType<TargetInput>;
}, TContext>;
export declare const getReconGeoipUrl: () => string;
/**
 * @summary IP Geolocation
 */
export declare const reconGeoip: (targetInput: TargetInput, options?: RequestInit) => Promise<GeoipResult>;
export declare const getReconGeoipMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof reconGeoip>>, TError, {
        data: BodyType<TargetInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof reconGeoip>>, TError, {
    data: BodyType<TargetInput>;
}, TContext>;
export type ReconGeoipMutationResult = NonNullable<Awaited<ReturnType<typeof reconGeoip>>>;
export type ReconGeoipMutationBody = BodyType<TargetInput>;
export type ReconGeoipMutationError = ErrorType<unknown>;
/**
* @summary IP Geolocation
*/
export declare const useReconGeoip: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof reconGeoip>>, TError, {
        data: BodyType<TargetInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof reconGeoip>>, TError, {
    data: BodyType<TargetInput>;
}, TContext>;
export declare const getReconSslUrl: () => string;
/**
 * @summary SSL Certificate Inspector
 */
export declare const reconSsl: (targetInput: TargetInput, options?: RequestInit) => Promise<SslResult>;
export declare const getReconSslMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof reconSsl>>, TError, {
        data: BodyType<TargetInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof reconSsl>>, TError, {
    data: BodyType<TargetInput>;
}, TContext>;
export type ReconSslMutationResult = NonNullable<Awaited<ReturnType<typeof reconSsl>>>;
export type ReconSslMutationBody = BodyType<TargetInput>;
export type ReconSslMutationError = ErrorType<unknown>;
/**
* @summary SSL Certificate Inspector
*/
export declare const useReconSsl: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof reconSsl>>, TError, {
        data: BodyType<TargetInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof reconSsl>>, TError, {
    data: BodyType<TargetInput>;
}, TContext>;
export declare const getReconHeadersUrl: () => string;
/**
 * @summary HTTP Header Analyzer
 */
export declare const reconHeaders: (targetInput: TargetInput, options?: RequestInit) => Promise<HeadersResult>;
export declare const getReconHeadersMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof reconHeaders>>, TError, {
        data: BodyType<TargetInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof reconHeaders>>, TError, {
    data: BodyType<TargetInput>;
}, TContext>;
export type ReconHeadersMutationResult = NonNullable<Awaited<ReturnType<typeof reconHeaders>>>;
export type ReconHeadersMutationBody = BodyType<TargetInput>;
export type ReconHeadersMutationError = ErrorType<unknown>;
/**
* @summary HTTP Header Analyzer
*/
export declare const useReconHeaders: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof reconHeaders>>, TError, {
        data: BodyType<TargetInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof reconHeaders>>, TError, {
    data: BodyType<TargetInput>;
}, TContext>;
export declare const getReconTechDetectUrl: () => string;
/**
 * @summary Technology Detection
 */
export declare const reconTechDetect: (targetInput: TargetInput, options?: RequestInit) => Promise<TechDetectResult>;
export declare const getReconTechDetectMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof reconTechDetect>>, TError, {
        data: BodyType<TargetInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof reconTechDetect>>, TError, {
    data: BodyType<TargetInput>;
}, TContext>;
export type ReconTechDetectMutationResult = NonNullable<Awaited<ReturnType<typeof reconTechDetect>>>;
export type ReconTechDetectMutationBody = BodyType<TargetInput>;
export type ReconTechDetectMutationError = ErrorType<unknown>;
/**
* @summary Technology Detection
*/
export declare const useReconTechDetect: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof reconTechDetect>>, TError, {
        data: BodyType<TargetInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof reconTechDetect>>, TError, {
    data: BodyType<TargetInput>;
}, TContext>;
export declare const getReconSubdomainsUrl: () => string;
/**
 * @summary Subdomain Discovery
 */
export declare const reconSubdomains: (targetInput: TargetInput, options?: RequestInit) => Promise<SubdomainResult>;
export declare const getReconSubdomainsMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof reconSubdomains>>, TError, {
        data: BodyType<TargetInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof reconSubdomains>>, TError, {
    data: BodyType<TargetInput>;
}, TContext>;
export type ReconSubdomainsMutationResult = NonNullable<Awaited<ReturnType<typeof reconSubdomains>>>;
export type ReconSubdomainsMutationBody = BodyType<TargetInput>;
export type ReconSubdomainsMutationError = ErrorType<unknown>;
/**
* @summary Subdomain Discovery
*/
export declare const useReconSubdomains: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof reconSubdomains>>, TError, {
        data: BodyType<TargetInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof reconSubdomains>>, TError, {
    data: BodyType<TargetInput>;
}, TContext>;
export declare const getReconScreenshotUrl: () => string;
/**
 * @summary Website Screenshot Capture
 */
export declare const reconScreenshot: (targetInput: TargetInput, options?: RequestInit) => Promise<ScreenshotResult>;
export declare const getReconScreenshotMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof reconScreenshot>>, TError, {
        data: BodyType<TargetInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof reconScreenshot>>, TError, {
    data: BodyType<TargetInput>;
}, TContext>;
export type ReconScreenshotMutationResult = NonNullable<Awaited<ReturnType<typeof reconScreenshot>>>;
export type ReconScreenshotMutationBody = BodyType<TargetInput>;
export type ReconScreenshotMutationError = ErrorType<unknown>;
/**
* @summary Website Screenshot Capture
*/
export declare const useReconScreenshot: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof reconScreenshot>>, TError, {
        data: BodyType<TargetInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof reconScreenshot>>, TError, {
    data: BodyType<TargetInput>;
}, TContext>;
export declare const getThreatUrlReputationUrl: () => string;
/**
 * @summary URL Reputation Checker
 */
export declare const threatUrlReputation: (targetInput: TargetInput, options?: RequestInit) => Promise<ReputationResult>;
export declare const getThreatUrlReputationMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof threatUrlReputation>>, TError, {
        data: BodyType<TargetInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof threatUrlReputation>>, TError, {
    data: BodyType<TargetInput>;
}, TContext>;
export type ThreatUrlReputationMutationResult = NonNullable<Awaited<ReturnType<typeof threatUrlReputation>>>;
export type ThreatUrlReputationMutationBody = BodyType<TargetInput>;
export type ThreatUrlReputationMutationError = ErrorType<unknown>;
/**
* @summary URL Reputation Checker
*/
export declare const useThreatUrlReputation: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof threatUrlReputation>>, TError, {
        data: BodyType<TargetInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof threatUrlReputation>>, TError, {
    data: BodyType<TargetInput>;
}, TContext>;
export declare const getThreatIpReputationUrl: () => string;
/**
 * @summary IP Reputation Checker
 */
export declare const threatIpReputation: (targetInput: TargetInput, options?: RequestInit) => Promise<ReputationResult>;
export declare const getThreatIpReputationMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof threatIpReputation>>, TError, {
        data: BodyType<TargetInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof threatIpReputation>>, TError, {
    data: BodyType<TargetInput>;
}, TContext>;
export type ThreatIpReputationMutationResult = NonNullable<Awaited<ReturnType<typeof threatIpReputation>>>;
export type ThreatIpReputationMutationBody = BodyType<TargetInput>;
export type ThreatIpReputationMutationError = ErrorType<unknown>;
/**
* @summary IP Reputation Checker
*/
export declare const useThreatIpReputation: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof threatIpReputation>>, TError, {
        data: BodyType<TargetInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof threatIpReputation>>, TError, {
    data: BodyType<TargetInput>;
}, TContext>;
export declare const getThreatDomainReputationUrl: () => string;
/**
 * @summary Domain Reputation Checker
 */
export declare const threatDomainReputation: (targetInput: TargetInput, options?: RequestInit) => Promise<ReputationResult>;
export declare const getThreatDomainReputationMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof threatDomainReputation>>, TError, {
        data: BodyType<TargetInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof threatDomainReputation>>, TError, {
    data: BodyType<TargetInput>;
}, TContext>;
export type ThreatDomainReputationMutationResult = NonNullable<Awaited<ReturnType<typeof threatDomainReputation>>>;
export type ThreatDomainReputationMutationBody = BodyType<TargetInput>;
export type ThreatDomainReputationMutationError = ErrorType<unknown>;
/**
* @summary Domain Reputation Checker
*/
export declare const useThreatDomainReputation: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof threatDomainReputation>>, TError, {
        data: BodyType<TargetInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof threatDomainReputation>>, TError, {
    data: BodyType<TargetInput>;
}, TContext>;
export declare const getThreatPhishingUrl: () => string;
/**
 * @summary Phishing Detection
 */
export declare const threatPhishing: (targetInput: TargetInput, options?: RequestInit) => Promise<PhishingResult>;
export declare const getThreatPhishingMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof threatPhishing>>, TError, {
        data: BodyType<TargetInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof threatPhishing>>, TError, {
    data: BodyType<TargetInput>;
}, TContext>;
export type ThreatPhishingMutationResult = NonNullable<Awaited<ReturnType<typeof threatPhishing>>>;
export type ThreatPhishingMutationBody = BodyType<TargetInput>;
export type ThreatPhishingMutationError = ErrorType<unknown>;
/**
* @summary Phishing Detection
*/
export declare const useThreatPhishing: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof threatPhishing>>, TError, {
        data: BodyType<TargetInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof threatPhishing>>, TError, {
    data: BodyType<TargetInput>;
}, TContext>;
export declare const getThreatSuspiciousUrlUrl: () => string;
/**
 * @summary Suspicious URL Analyzer
 */
export declare const threatSuspiciousUrl: (targetInput: TargetInput, options?: RequestInit) => Promise<SuspiciousUrlResult>;
export declare const getThreatSuspiciousUrlMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof threatSuspiciousUrl>>, TError, {
        data: BodyType<TargetInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof threatSuspiciousUrl>>, TError, {
    data: BodyType<TargetInput>;
}, TContext>;
export type ThreatSuspiciousUrlMutationResult = NonNullable<Awaited<ReturnType<typeof threatSuspiciousUrl>>>;
export type ThreatSuspiciousUrlMutationBody = BodyType<TargetInput>;
export type ThreatSuspiciousUrlMutationError = ErrorType<unknown>;
/**
* @summary Suspicious URL Analyzer
*/
export declare const useThreatSuspiciousUrl: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof threatSuspiciousUrl>>, TError, {
        data: BodyType<TargetInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof threatSuspiciousUrl>>, TError, {
    data: BodyType<TargetInput>;
}, TContext>;
export declare const getThreatVirusTotalUrl: () => string;
/**
 * @summary VirusTotal Integration
 */
export declare const threatVirusTotal: (targetInput: TargetInput, options?: RequestInit) => Promise<VirusTotalResult>;
export declare const getThreatVirusTotalMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof threatVirusTotal>>, TError, {
        data: BodyType<TargetInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof threatVirusTotal>>, TError, {
    data: BodyType<TargetInput>;
}, TContext>;
export type ThreatVirusTotalMutationResult = NonNullable<Awaited<ReturnType<typeof threatVirusTotal>>>;
export type ThreatVirusTotalMutationBody = BodyType<TargetInput>;
export type ThreatVirusTotalMutationError = ErrorType<unknown>;
/**
* @summary VirusTotal Integration
*/
export declare const useThreatVirusTotal: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof threatVirusTotal>>, TError, {
        data: BodyType<TargetInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof threatVirusTotal>>, TError, {
    data: BodyType<TargetInput>;
}, TContext>;
export declare const getThreatAbuseIpdbUrl: () => string;
/**
 * @summary AbuseIPDB Integration
 */
export declare const threatAbuseIpdb: (targetInput: TargetInput, options?: RequestInit) => Promise<AbuseIpdbResult>;
export declare const getThreatAbuseIpdbMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof threatAbuseIpdb>>, TError, {
        data: BodyType<TargetInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof threatAbuseIpdb>>, TError, {
    data: BodyType<TargetInput>;
}, TContext>;
export type ThreatAbuseIpdbMutationResult = NonNullable<Awaited<ReturnType<typeof threatAbuseIpdb>>>;
export type ThreatAbuseIpdbMutationBody = BodyType<TargetInput>;
export type ThreatAbuseIpdbMutationError = ErrorType<unknown>;
/**
* @summary AbuseIPDB Integration
*/
export declare const useThreatAbuseIpdb: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof threatAbuseIpdb>>, TError, {
        data: BodyType<TargetInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof threatAbuseIpdb>>, TError, {
    data: BodyType<TargetInput>;
}, TContext>;
export declare const getThreatOpenPhishUrl: () => string;
/**
 * @summary OpenPhish Feed Integration
 */
export declare const threatOpenPhish: (targetInput: TargetInput, options?: RequestInit) => Promise<GenericResult>;
export declare const getThreatOpenPhishMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof threatOpenPhish>>, TError, {
        data: BodyType<TargetInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof threatOpenPhish>>, TError, {
    data: BodyType<TargetInput>;
}, TContext>;
export type ThreatOpenPhishMutationResult = NonNullable<Awaited<ReturnType<typeof threatOpenPhish>>>;
export type ThreatOpenPhishMutationBody = BodyType<TargetInput>;
export type ThreatOpenPhishMutationError = ErrorType<unknown>;
/**
* @summary OpenPhish Feed Integration
*/
export declare const useThreatOpenPhish: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof threatOpenPhish>>, TError, {
        data: BodyType<TargetInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof threatOpenPhish>>, TError, {
    data: BodyType<TargetInput>;
}, TContext>;
export declare const getThreatBreachUrl: () => string;
/**
 * @summary Known Data Breach Checker
 */
export declare const threatBreach: (targetInput: TargetInput, options?: RequestInit) => Promise<BreachResult>;
export declare const getThreatBreachMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof threatBreach>>, TError, {
        data: BodyType<TargetInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof threatBreach>>, TError, {
    data: BodyType<TargetInput>;
}, TContext>;
export type ThreatBreachMutationResult = NonNullable<Awaited<ReturnType<typeof threatBreach>>>;
export type ThreatBreachMutationBody = BodyType<TargetInput>;
export type ThreatBreachMutationError = ErrorType<unknown>;
/**
* @summary Known Data Breach Checker
*/
export declare const useThreatBreach: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof threatBreach>>, TError, {
        data: BodyType<TargetInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof threatBreach>>, TError, {
    data: BodyType<TargetInput>;
}, TContext>;
export declare const getFileHashUrl: () => string;
/**
 * @summary SHA256/MD5 Generator
 */
export declare const fileHash: (fileDataInput: FileDataInput, options?: RequestInit) => Promise<HashResult>;
export declare const getFileHashMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof fileHash>>, TError, {
        data: BodyType<FileDataInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof fileHash>>, TError, {
    data: BodyType<FileDataInput>;
}, TContext>;
export type FileHashMutationResult = NonNullable<Awaited<ReturnType<typeof fileHash>>>;
export type FileHashMutationBody = BodyType<FileDataInput>;
export type FileHashMutationError = ErrorType<unknown>;
/**
* @summary SHA256/MD5 Generator
*/
export declare const useFileHash: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof fileHash>>, TError, {
        data: BodyType<FileDataInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof fileHash>>, TError, {
    data: BodyType<FileDataInput>;
}, TContext>;
export declare const getFileHashCompareUrl: () => string;
/**
 * @summary Hash Comparison
 */
export declare const fileHashCompare: (hashCompareInput: HashCompareInput, options?: RequestInit) => Promise<GenericResult>;
export declare const getFileHashCompareMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof fileHashCompare>>, TError, {
        data: BodyType<HashCompareInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof fileHashCompare>>, TError, {
    data: BodyType<HashCompareInput>;
}, TContext>;
export type FileHashCompareMutationResult = NonNullable<Awaited<ReturnType<typeof fileHashCompare>>>;
export type FileHashCompareMutationBody = BodyType<HashCompareInput>;
export type FileHashCompareMutationError = ErrorType<unknown>;
/**
* @summary Hash Comparison
*/
export declare const useFileHashCompare: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof fileHashCompare>>, TError, {
        data: BodyType<HashCompareInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof fileHashCompare>>, TError, {
    data: BodyType<HashCompareInput>;
}, TContext>;
export declare const getFileMetadataUrl: () => string;
/**
 * @summary File Metadata Extraction
 */
export declare const fileMetadata: (fileDataInput: FileDataInput, options?: RequestInit) => Promise<FileMetadataResult>;
export declare const getFileMetadataMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof fileMetadata>>, TError, {
        data: BodyType<FileDataInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof fileMetadata>>, TError, {
    data: BodyType<FileDataInput>;
}, TContext>;
export type FileMetadataMutationResult = NonNullable<Awaited<ReturnType<typeof fileMetadata>>>;
export type FileMetadataMutationBody = BodyType<FileDataInput>;
export type FileMetadataMutationError = ErrorType<unknown>;
/**
* @summary File Metadata Extraction
*/
export declare const useFileMetadata: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof fileMetadata>>, TError, {
        data: BodyType<FileDataInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof fileMetadata>>, TError, {
    data: BodyType<FileDataInput>;
}, TContext>;
export declare const getFileEntropyUrl: () => string;
/**
 * @summary Entropy Analysis
 */
export declare const fileEntropy: (fileDataInput: FileDataInput, options?: RequestInit) => Promise<EntropyResult>;
export declare const getFileEntropyMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof fileEntropy>>, TError, {
        data: BodyType<FileDataInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof fileEntropy>>, TError, {
    data: BodyType<FileDataInput>;
}, TContext>;
export type FileEntropyMutationResult = NonNullable<Awaited<ReturnType<typeof fileEntropy>>>;
export type FileEntropyMutationBody = BodyType<FileDataInput>;
export type FileEntropyMutationError = ErrorType<unknown>;
/**
* @summary Entropy Analysis
*/
export declare const useFileEntropy: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof fileEntropy>>, TError, {
        data: BodyType<FileDataInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof fileEntropy>>, TError, {
    data: BodyType<FileDataInput>;
}, TContext>;
export declare const getFileMalwareHashUrl: () => string;
/**
 * @summary Malware Hash Lookup
 */
export declare const fileMalwareHash: (targetInput: TargetInput, options?: RequestInit) => Promise<MalwareHashResult>;
export declare const getFileMalwareHashMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof fileMalwareHash>>, TError, {
        data: BodyType<TargetInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof fileMalwareHash>>, TError, {
    data: BodyType<TargetInput>;
}, TContext>;
export type FileMalwareHashMutationResult = NonNullable<Awaited<ReturnType<typeof fileMalwareHash>>>;
export type FileMalwareHashMutationBody = BodyType<TargetInput>;
export type FileMalwareHashMutationError = ErrorType<unknown>;
/**
* @summary Malware Hash Lookup
*/
export declare const useFileMalwareHash: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof fileMalwareHash>>, TError, {
        data: BodyType<TargetInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof fileMalwareHash>>, TError, {
    data: BodyType<TargetInput>;
}, TContext>;
export declare const getFileYaraUrl: () => string;
/**
 * @summary YARA Rule Scanner
 */
export declare const fileYara: (yaraInput: YaraInput, options?: RequestInit) => Promise<YaraResult>;
export declare const getFileYaraMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof fileYara>>, TError, {
        data: BodyType<YaraInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof fileYara>>, TError, {
    data: BodyType<YaraInput>;
}, TContext>;
export type FileYaraMutationResult = NonNullable<Awaited<ReturnType<typeof fileYara>>>;
export type FileYaraMutationBody = BodyType<YaraInput>;
export type FileYaraMutationError = ErrorType<unknown>;
/**
* @summary YARA Rule Scanner
*/
export declare const useFileYara: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof fileYara>>, TError, {
        data: BodyType<YaraInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof fileYara>>, TError, {
    data: BodyType<YaraInput>;
}, TContext>;
export declare const getFileSignatureUrl: () => string;
/**
 * @summary File Signature Verification
 */
export declare const fileSignature: (fileDataInput: FileDataInput, options?: RequestInit) => Promise<SignatureResult>;
export declare const getFileSignatureMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof fileSignature>>, TError, {
        data: BodyType<FileDataInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof fileSignature>>, TError, {
    data: BodyType<FileDataInput>;
}, TContext>;
export type FileSignatureMutationResult = NonNullable<Awaited<ReturnType<typeof fileSignature>>>;
export type FileSignatureMutationBody = BodyType<FileDataInput>;
export type FileSignatureMutationError = ErrorType<unknown>;
/**
* @summary File Signature Verification
*/
export declare const useFileSignature: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof fileSignature>>, TError, {
        data: BodyType<FileDataInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof fileSignature>>, TError, {
    data: BodyType<FileDataInput>;
}, TContext>;
export declare const getPasswordStrengthUrl: () => string;
/**
 * @summary Password Strength Analyzer
 */
export declare const passwordStrength: (passwordInput: PasswordInput, options?: RequestInit) => Promise<PasswordStrengthResult>;
export declare const getPasswordStrengthMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof passwordStrength>>, TError, {
        data: BodyType<PasswordInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof passwordStrength>>, TError, {
    data: BodyType<PasswordInput>;
}, TContext>;
export type PasswordStrengthMutationResult = NonNullable<Awaited<ReturnType<typeof passwordStrength>>>;
export type PasswordStrengthMutationBody = BodyType<PasswordInput>;
export type PasswordStrengthMutationError = ErrorType<unknown>;
/**
* @summary Password Strength Analyzer
*/
export declare const usePasswordStrength: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof passwordStrength>>, TError, {
        data: BodyType<PasswordInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof passwordStrength>>, TError, {
    data: BodyType<PasswordInput>;
}, TContext>;
export declare const getPasswordBreachUrl: () => string;
/**
 * @summary Password Breach Checker
 */
export declare const passwordBreach: (passwordInput: PasswordInput, options?: RequestInit) => Promise<PasswordBreachResult>;
export declare const getPasswordBreachMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof passwordBreach>>, TError, {
        data: BodyType<PasswordInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof passwordBreach>>, TError, {
    data: BodyType<PasswordInput>;
}, TContext>;
export type PasswordBreachMutationResult = NonNullable<Awaited<ReturnType<typeof passwordBreach>>>;
export type PasswordBreachMutationBody = BodyType<PasswordInput>;
export type PasswordBreachMutationError = ErrorType<unknown>;
/**
* @summary Password Breach Checker
*/
export declare const usePasswordBreach: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof passwordBreach>>, TError, {
        data: BodyType<PasswordInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof passwordBreach>>, TError, {
    data: BodyType<PasswordInput>;
}, TContext>;
export declare const getPasswordEntropyUrl: () => string;
/**
 * @summary Password Entropy Calculator
 */
export declare const passwordEntropy: (passwordInput: PasswordInput, options?: RequestInit) => Promise<PasswordEntropyResult>;
export declare const getPasswordEntropyMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof passwordEntropy>>, TError, {
        data: BodyType<PasswordInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof passwordEntropy>>, TError, {
    data: BodyType<PasswordInput>;
}, TContext>;
export type PasswordEntropyMutationResult = NonNullable<Awaited<ReturnType<typeof passwordEntropy>>>;
export type PasswordEntropyMutationBody = BodyType<PasswordInput>;
export type PasswordEntropyMutationError = ErrorType<unknown>;
/**
* @summary Password Entropy Calculator
*/
export declare const usePasswordEntropy: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof passwordEntropy>>, TError, {
        data: BodyType<PasswordInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof passwordEntropy>>, TError, {
    data: BodyType<PasswordInput>;
}, TContext>;
export declare const getPasswordGenerateUrl: () => string;
/**
 * @summary Random Password Generator
 */
export declare const passwordGenerate: (passwordGenerateInput: PasswordGenerateInput, options?: RequestInit) => Promise<PasswordGenerateResult>;
export declare const getPasswordGenerateMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof passwordGenerate>>, TError, {
        data: BodyType<PasswordGenerateInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof passwordGenerate>>, TError, {
    data: BodyType<PasswordGenerateInput>;
}, TContext>;
export type PasswordGenerateMutationResult = NonNullable<Awaited<ReturnType<typeof passwordGenerate>>>;
export type PasswordGenerateMutationBody = BodyType<PasswordGenerateInput>;
export type PasswordGenerateMutationError = ErrorType<unknown>;
/**
* @summary Random Password Generator
*/
export declare const usePasswordGenerate: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof passwordGenerate>>, TError, {
        data: BodyType<PasswordGenerateInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof passwordGenerate>>, TError, {
    data: BodyType<PasswordGenerateInput>;
}, TContext>;
export declare const getPasswordPassphraseUrl: () => string;
/**
 * @summary Passphrase Generator
 */
export declare const passwordPassphrase: (passphraseInput: PassphraseInput, options?: RequestInit) => Promise<PassphraseResult>;
export declare const getPasswordPassphraseMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof passwordPassphrase>>, TError, {
        data: BodyType<PassphraseInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof passwordPassphrase>>, TError, {
    data: BodyType<PassphraseInput>;
}, TContext>;
export type PasswordPassphraseMutationResult = NonNullable<Awaited<ReturnType<typeof passwordPassphrase>>>;
export type PasswordPassphraseMutationBody = BodyType<PassphraseInput>;
export type PasswordPassphraseMutationError = ErrorType<unknown>;
/**
* @summary Passphrase Generator
*/
export declare const usePasswordPassphrase: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof passwordPassphrase>>, TError, {
        data: BodyType<PassphraseInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof passwordPassphrase>>, TError, {
    data: BodyType<PassphraseInput>;
}, TContext>;
export declare const getNetworkPortScanUrl: () => string;
/**
 * @summary Port Scanner
 */
export declare const networkPortScan: (portScanInput: PortScanInput, options?: RequestInit) => Promise<PortScanResult>;
export declare const getNetworkPortScanMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof networkPortScan>>, TError, {
        data: BodyType<PortScanInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof networkPortScan>>, TError, {
    data: BodyType<PortScanInput>;
}, TContext>;
export type NetworkPortScanMutationResult = NonNullable<Awaited<ReturnType<typeof networkPortScan>>>;
export type NetworkPortScanMutationBody = BodyType<PortScanInput>;
export type NetworkPortScanMutationError = ErrorType<unknown>;
/**
* @summary Port Scanner
*/
export declare const useNetworkPortScan: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof networkPortScan>>, TError, {
        data: BodyType<PortScanInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof networkPortScan>>, TError, {
    data: BodyType<PortScanInput>;
}, TContext>;
export declare const getNetworkPingUrl: () => string;
/**
 * @summary Ping Sweeper
 */
export declare const networkPing: (targetInput: TargetInput, options?: RequestInit) => Promise<PingResult>;
export declare const getNetworkPingMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof networkPing>>, TError, {
        data: BodyType<TargetInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof networkPing>>, TError, {
    data: BodyType<TargetInput>;
}, TContext>;
export type NetworkPingMutationResult = NonNullable<Awaited<ReturnType<typeof networkPing>>>;
export type NetworkPingMutationBody = BodyType<TargetInput>;
export type NetworkPingMutationError = ErrorType<unknown>;
/**
* @summary Ping Sweeper
*/
export declare const useNetworkPing: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof networkPing>>, TError, {
        data: BodyType<TargetInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof networkPing>>, TError, {
    data: BodyType<TargetInput>;
}, TContext>;
export declare const getNetworkTracerouteUrl: () => string;
/**
 * @summary Traceroute Visualization
 */
export declare const networkTraceroute: (targetInput: TargetInput, options?: RequestInit) => Promise<TracerouteResult>;
export declare const getNetworkTracerouteMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof networkTraceroute>>, TError, {
        data: BodyType<TargetInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof networkTraceroute>>, TError, {
    data: BodyType<TargetInput>;
}, TContext>;
export type NetworkTracerouteMutationResult = NonNullable<Awaited<ReturnType<typeof networkTraceroute>>>;
export type NetworkTracerouteMutationBody = BodyType<TargetInput>;
export type NetworkTracerouteMutationError = ErrorType<unknown>;
/**
* @summary Traceroute Visualization
*/
export declare const useNetworkTraceroute: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof networkTraceroute>>, TError, {
        data: BodyType<TargetInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof networkTraceroute>>, TError, {
    data: BodyType<TargetInput>;
}, TContext>;
export declare const getNetworkBannerUrl: () => string;
/**
 * @summary Banner Grabbing
 */
export declare const networkBanner: (bannerInput: BannerInput, options?: RequestInit) => Promise<BannerResult>;
export declare const getNetworkBannerMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof networkBanner>>, TError, {
        data: BodyType<BannerInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof networkBanner>>, TError, {
    data: BodyType<BannerInput>;
}, TContext>;
export type NetworkBannerMutationResult = NonNullable<Awaited<ReturnType<typeof networkBanner>>>;
export type NetworkBannerMutationBody = BodyType<BannerInput>;
export type NetworkBannerMutationError = ErrorType<unknown>;
/**
* @summary Banner Grabbing
*/
export declare const useNetworkBanner: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof networkBanner>>, TError, {
        data: BodyType<BannerInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof networkBanner>>, TError, {
    data: BodyType<BannerInput>;
}, TContext>;
export declare const getNetworkMapperUrl: () => string;
/**
 * @summary Network Mapper Dashboard
 */
export declare const networkMapper: (targetInput: TargetInput, options?: RequestInit) => Promise<NetworkMapResult>;
export declare const getNetworkMapperMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof networkMapper>>, TError, {
        data: BodyType<TargetInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof networkMapper>>, TError, {
    data: BodyType<TargetInput>;
}, TContext>;
export type NetworkMapperMutationResult = NonNullable<Awaited<ReturnType<typeof networkMapper>>>;
export type NetworkMapperMutationBody = BodyType<TargetInput>;
export type NetworkMapperMutationError = ErrorType<unknown>;
/**
* @summary Network Mapper Dashboard
*/
export declare const useNetworkMapper: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof networkMapper>>, TError, {
        data: BodyType<TargetInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof networkMapper>>, TError, {
    data: BodyType<TargetInput>;
}, TContext>;
export {};
//# sourceMappingURL=api.d.ts.map