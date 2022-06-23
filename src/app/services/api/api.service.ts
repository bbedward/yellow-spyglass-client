import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { saveAs } from 'file-saver';
import {
    AccountBalanceDto,
    AccountDistributionStatsDto,
    AccountNFTDto,
    AccountOverviewDto,
    AliasDto,
    BlockDto,
    ConfirmedTransactionDto,
    DelegatorsOverviewDto,
    ExplorerSummaryDto,
    HostNodeStatsDto,
    KnownAccountDto,
    MonitoredRepDto,
    NakamotoCoefficientDto,
    PeerVersionsDto,
    PriceDataDto,
    QuorumDto,
    ReceivableTransactionDto,
    RepresentativeDto,
    RepScoreDto,
    SupplyDto,
} from '@app/types/dto';
import { InsightsDto } from '@app/types/dto/InsightsDto';
import {Subject} from "rxjs";

@Injectable({
    providedIn: 'root',
})
export class ApiService {

    api: string;
    apiToUseSubject = new Subject<string>;

    constructor(private readonly _http: HttpClient) {
        this._pingServers();
    }

    /** On app load, pings 2 separate APIs to see which one is faster.  Use that one for this session. */
    private _pingServers(): void {
        const api1 = environment.api1;
        const api2 = environment.api2;
        const req1 = new Promise((resolve) => {
            // TODO: Replace this with an actual PING endpoint.  Make this as fast as possible.
            this._http.get<any>(`${api1}/v1/representatives/online`)
                .toPromise().then(() => resolve(api1))
                .catch((err) => {
                    console.error(err);
                    resolve(api2); // If error, resolve the opposite api.
                });
        });
        const req2 = new Promise((resolve) => {
            this._http.get<any>(`${api2}/v1/representatives/online`)
                .toPromise().then(() => resolve(api2))
                .catch((err) => {
                    console.error(err);
                    resolve(api1);
                });
        });

        Promise.race([req1, req2]).then((faster: string) => {
            this.apiToUseSubject.next(faster);
        }).catch((err) => {
            console.error(err);
        })
    }

    /** Resolves after the API to use has been set. */
    private _hasPingedApi(): Promise<void> {
        return new Promise((resolve) => {
            if (this.api) {
                resolve();
            } else {
                this.apiToUseSubject.subscribe((fastestApi) => {
                    this.api = fastestApi;
                    resolve();
                })
            }
        });
    }

    /** Given an address, returns a monKey API URL. */
    createMonKeyUrl(address: string): string {
        return `https://monkey.banano.cc/api/v1/monkey/${address}`;
    }

    /** Fetches explorer summary information. */
    async fetchExplorerSummaryData(): Promise<ExplorerSummaryDto> {
        await this._hasPingedApi();
        return this._http.get<ExplorerSummaryDto>(`${this.api}/v1/explorer-summary`).toPromise();
    }

    /** Fetches account summary information. */
    async fetchAccountOverview(address: string): Promise<AccountOverviewDto> {
        await this._hasPingedApi();
        return this._http.get<AccountOverviewDto>(`${this.api}/v1/account/overview/${address}`).toPromise();
    }

    /** Fetches account summary information. */
    async fetchAccountNFTs(address: string): Promise<AccountNFTDto[]> {
        await this._hasPingedApi();
        return this._http.get<AccountNFTDto[]>(`${this.api}/v1/account/nfts/${address}`).toPromise();
    }

    /** Fetches account delegators. */
    async fetchAccountDelegators(address: string, offset: number): Promise<DelegatorsOverviewDto> {
        await this._hasPingedApi();
        return this._http
            .post<DelegatorsOverviewDto>(`${this.api}/v1/account/delegators`, { address, size: 50, offset })
            .toPromise();
    }

    /** Fetches 50 confirmed transactions for a given address. */
    async fetchConfirmedTransactions(address: string, offset: number, pageSize: number): Promise<ConfirmedTransactionDto[]> {
        await this._hasPingedApi();
        return this._http
            .post<ConfirmedTransactionDto[]>(`${this.api}/v2/account/confirmed-transactions`, {
                address,
                offset,
                size: pageSize,
            })
            .toPromise();
    }

    /** Fetches 50 receivable transactions for a given address. */
    async fetchReceivableTransactions(address: string): Promise<ReceivableTransactionDto[]> {
        await this._hasPingedApi();
        return this._http
            .post<ReceivableTransactionDto[]>(`${this.api}/v1/account/receivable-transactions`, { address })
            .toPromise();
    }

    /** Fetches historic account statistics. */
    async fetchInsights(address: string): Promise<InsightsDto> {
        await this._hasPingedApi();
        return this._http
            .post<InsightsDto>(`${this.api}/v1/account/insights`, { address, includeHeightBalances: true })
            .toPromise();
    }

    /** Given a hash, fetches block. */
    async fetchBlock(hash: string): Promise<BlockDto> {
        await this._hasPingedApi();
        return this._http.get<BlockDto>(`${this.api}/v1/block/${hash}`).toPromise();
    }

    /** Fetches list of known vanities addresses. */
    async fetchKnownVanities(): Promise<string[]> {
        await this._hasPingedApi();
        return this._http.get<string[]>(`${this.api}/v1/known/vanities`).toPromise();
    }

    /** Fetches server stats & info. */
    async fetchHostNodeStats(): Promise<HostNodeStatsDto> {
        await this._hasPingedApi();
        return this._http.get<HostNodeStatsDto>(`${this.api}/v1/network/node-stats`).toPromise();
    }

    /** Fetches monKey avatar for a given account. */
    async fetchMonKey(address: string): Promise<string> {
        await this._hasPingedApi();
        const headers = new HttpHeaders().set('Content-Type', 'text/plain; charset=utf-8');
        return this._http
            .get(`https://monkey.banano.cc/api/v1/monkey/${address}`, { headers, responseType: 'text' })
            .toPromise<string>();
    }

    /** Fetches representatives stats. */
    async fetchLargeRepresentatives(): Promise<RepresentativeDto[]> {
        await this._hasPingedApi();
        return this._http
            .post<RepresentativeDto[]>(`${this.api}/v1/representatives`, {
                minimumWeight: 100_000,
                includeDelegatorCount: true,
            })
            .toPromise();
    }

    /** Fetches monitored representatives stats. */
    async fetchMonitoredRepresentatives(): Promise<MonitoredRepDto[]> {
        await this._hasPingedApi();
        return this._http.get<MonitoredRepDto[]>(`${this.api}/v1/representatives/monitored`).toPromise();
    }

    /** Fetches representatives stats. */
    async fetchRepresentativeScores(): Promise<RepScoreDto[]> {
        await this._hasPingedApi();
        return this._http.get<RepScoreDto[]>(`${this.api}/v1/representatives/scores`).toPromise();
    }

    /** Fetches distribute buckets; how many accounts own (1-10 ban, 10-100, etc). */
    async fetchDistributionStats(): Promise<AccountDistributionStatsDto> {
        await this._hasPingedApi();
        return this._http.get<AccountDistributionStatsDto>(`${this.api}/v1/distribution/buckets`).toPromise();
    }

    /** Fetches quorum details. */
    async fetchQuorumStats(): Promise<QuorumDto> {
        await this._hasPingedApi();
        return this._http.get<QuorumDto>(`${this.api}/v1/network/quorum`).toPromise();
    }

    /** Fetches Supply details. */
    async fetchSupplyStats(): Promise<SupplyDto> {
        await this._hasPingedApi();
        return this._http.get<SupplyDto>(`${this.api}/v1/distribution/supply`).toPromise();
    }

    /** Fetches Peer details. */
    async fetchPeerVersions(): Promise<PeerVersionsDto[]> {
        await this._hasPingedApi();
        return this._http.get<PeerVersionsDto[]>(`${this.api}/v1/network/peers`).toPromise();
    }

    /** Fetches how many bad actors required to compromise network. */
    async fetchNakamotoCoefficient(): Promise<NakamotoCoefficientDto> {
        await this._hasPingedApi();
        return this._http
            .get<NakamotoCoefficientDto>(`${this.api}/v1/network/nakamoto-coefficient`)
            .toPromise();
    }

    /** Fetches list of accounts with their respective balance & representative. */
    async fetchRichListSegment(offset: number, size: number): Promise<AccountBalanceDto[]> {
        await this._hasPingedApi();
        return this._http
            .post<AccountBalanceDto[]>(`${this.api}/v1/distribution/rich-list`, {
                offset,
                size,
                includeRepresentative: true,
            })
            .toPromise();
    }

    /** Fetches all transaction history for a given account. */
    async downloadAccountTransactions(address: string): Promise<void> {
        await this._hasPingedApi();
        const fileName = `tx-${address}.csv`;
        return this._http
            .post(`${this.api}/v1/account/export`, { address }, { responseType: 'text' })
            .toPromise()
            .then((data) => {
                const blob = new Blob([data], { type: 'application/text' });
                saveAs(blob, fileName);
                return Promise.resolve();
            })
            .catch((err) => {
                const jsonErr = JSON.parse(err.error);
                return Promise.reject(jsonErr);
            });
    }

    /** Fetches banano price data. */
    async fetchPriceInfo(): Promise<PriceDataDto> {
        await this._hasPingedApi();
        return this._http.get<PriceDataDto>(`${this.api}/v1/price`).toPromise();
    }

    /** Fetches list of representatives that are considered online. */
    async fetchOnlineRepresentatives(): Promise<string[]> {
        await this._hasPingedApi();
        return this._http.get<string[]>(`${this.api}/v1/representatives/online`).toPromise();
    }

    /** Fetches list of aliases. */
    async fetchAliases(): Promise<AliasDto[]> {
        await this._hasPingedApi();
        return this._http
            .post<AliasDto[]>(`${this.api}/v1/known/accounts`, { includeOwner: false, includeType: false })
            .toPromise();
    }

    /** Fetches list of addresses with known aliases, owner, & type. */
    async fetchKnownAccounts(): Promise<KnownAccountDto[]> {
        await this._hasPingedApi();
        return this._http
            .post<KnownAccountDto[]>(`${this.api}/v1/known/accounts`, { includeOwner: true, includeType: true })
            .toPromise();
    }
}
